import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import Groq from "groq-sdk";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import Trip from "./models/Trip.js";

dotenv.config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(cors());

// ================== CONNECT MONGODB ==================
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.log("❌ MongoDB Error:", err));
} else {
  console.log("⚠️ MONGO_URI not found in .env — Auth will fail without DB");
}

// ================== INITIALIZE GROQ ==================
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ================== HELPER: GET COORDINATES ==================
async function getCoordinates(place) {
  if (!place) return { lat: null, lon: null };

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      place
    )}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "travel-ai-app" },
    });

    const data = await res.json();

    if (data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon };
    }
  } catch (e) {
    console.log("❌ Coordinate Fetch Error:", e);
  }

  return { lat: null, lon: null };
}

// ================== AUTH ROUTES ==================
app.use("/auth", authRoutes);

// ================== PLACE SEARCH ==================
app.get("/places", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "travel-ai-app" },
    });

    const data = await response.json();

    const cleaned = data.map((p) => ({
      place_id: p.place_id,
      display_name: p.display_name,
      lat: p.lat,
      lon: p.lon,
    }));

    res.json(cleaned);
  } catch (err) {
    console.error("❌ Places API Error:", err);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// ================== AI TRIP GENERATOR + SAVE DB ==================
app.post("/generate-trip", authMiddleware, async (req, res) => {
  const { destination, days, budget, travelWith } = req.body;

  if (!destination || !days) {
    return res.status(400).json({
      error: "Destination and days are required",
    });
  }

  try {
    const prompt = `
Generate a complete travel plan:

Destination: ${destination}
Days: ${days}
Budget: ${budget}
Travelers: ${travelWith}

Return ONLY VALID JSON in this format:

{
  "summary": {
    "best_time_to_visit": "",
    "travel_cost_estimate": "",
    "local_tips": []
  },
  "hotels": [
    { "name": "", "price_range": "", "rating": 4.5, "link": "" }
  ],
  "places_to_visit": [
    { "name": "", "description": "", "best_time": "" }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "",
      "plan": ["", ""],
      "location": ""
    }
  ]
}

ONLY JSON. No markdown.
`;

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    let aiText = completion.choices[0].message.content || "";
    aiText = aiText.replace(/```json|```/g, "").trim();

    let trip;
    try {
      trip = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        rawAI: aiText,
      });
    }

    for (const day of trip.itinerary) {
      const coords = await getCoordinates(day.location);
      day.lat = coords.lat;
      day.lon = coords.lon;
    }

    // ================== SAVE TRIP ==================
    await Trip.create({
      userId: req.user.id,
      destination,
      days,
      budget,
      travelWith,
      result: trip,
    });

    res.json({
      success: true,
      trip,
    });
  } catch (err) {
    console.error("🔥 Groq Trip Error:", err);
    res.status(500).json({ error: "AI failed to generate trip" });
  }
});

// ================== TRIP HISTORY ==================
app.get("/my-trips", authMiddleware, async (req, res) => {
  const trips = await Trip.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(trips);
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 AI Trip Planner Server running on port ${PORT}`)
);
