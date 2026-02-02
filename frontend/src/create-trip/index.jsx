import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/ui/MapView";
import UserSidebar from "../components/sidebar/UserSidebar";

const OptionSelector = ({ title, options, selected, onSelect }) => (
  <div>
    <h3 className="text-xl font-medium mb-2">{title}:</h3>
    <div className="flex gap-4 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.label}
          className={`p-3 border rounded w-40 text-left ${
            selected === opt.label ? "bg-green-500 text-white" : ""
          }`}
          onClick={() => onSelect(opt.label)}
        >
          <span className="text-2xl mr-2">{opt.emoji}</span>
          <span className="font-medium">{opt.label}</span>
          <div className="text-sm text-gray-500">{opt.description}</div>
        </button>
      ))}
    </div>
  </div>
);

function CreateTrip() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // ✅ get token from localStorage

  const [formData, setFormData] = useState({
    destination: "",
    days: 1,
    budget: "",
    travelWith: "",
  });

  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const budgetOptions = [
    { label: "Cheap", emoji: "💵", description: "Stay conscious of costs" },
    { label: "Moderate", emoji: "💰", description: "Average spending" },
    { label: "Luxury", emoji: "💸", description: "Premium experience" },
  ];

  const travelWithOptions = [
    { label: "Just Me", emoji: "✈️", description: "Solo traveler" },
    { label: "Couple", emoji: "🥂", description: "Romantic getaway" },
    { label: "Family", emoji: "🏡", description: "Family vacation" },
    { label: "Friends", emoji: "⛵", description: "Group adventure" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.destination) return "Please enter a destination.";
    if (formData.days < 1) return "Days must be at least 1.";
    if (!formData.budget) return "Select a budget.";
    if (!formData.travelWith) return "Who are you traveling with?";
    if (!token) return "You must be logged in to generate a trip."; // ✅ require login
    return null;
  };

  // ---------- AUTOCOMPLETE ----------
  const fetchPlaces = async (value) => {
    setQuery(value);

    if (value.length < 3) {
      setPlaces([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/places?q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  const handlePlaceSelect = (place) => {
    setFormData((prev) => ({
      ...prev,
      destination: place.display_name,
    }));
    setQuery(place.display_name);
    setPlaces([]);
    setCoords({
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    });
  };

  // ---------- SUBMIT FORM ----------
  const handleSubmit = async () => {
  const errorMsg = validateForm();
  if (errorMsg) {
    setError(errorMsg);
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await fetch("http://localhost:5000/generate-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        destination: formData.destination,
        days: formData.days,
        budget: formData.budget,
        travelWith: formData.travelWith, // ✅ match backend
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Server error");
      return;
    }

    // Pass only the trip object to TripResult
    navigate("/trip-result", {
      state: {
        trip: data.trip, // ✅ extract the trip object
        formData,
      },
    });
  } catch (err) {
    console.error("Trip generation error:", err);
    setError("Server is unreachable");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex min-h-screen">
      {user && <UserSidebar />}

      <div className="flex-1 sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 flex flex-col">
        <h2 className="font-bold text-3xl mb-6">
          Tell us your travel preferences...
        </h2>

        {error && <p className="mt-3 text-red-600 font-medium">{error}</p>}

        <div className="space-y-6 flex-grow">
          {/* DESTINATION */}
          <div>
            <h3 className="text-xl font-medium mb-2">Destination:</h3>
            <input
              type="text"
              placeholder="Search destination..."
              value={query}
              onChange={(e) => fetchPlaces(e.target.value)}
              className="border p-2 rounded w-full"
            />

            {places.length > 0 && (
              <ul className="border mt-2 max-h-40 overflow-y-auto bg-white shadow rounded">
                {places.map((place) => (
                  <li
                    key={place.place_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DAYS */}
          <div>
            <h3 className="text-xl font-medium mb-2">How many days?</h3>
            <input
              type="number"
              name="days"
              min="1"
              value={formData.days}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* BUDGET */}
          <OptionSelector
            title="Budget"
            options={budgetOptions}
            selected={formData.budget}
            onSelect={(value) => handleOptionSelect("budget", value)}
          />

          {/* TRAVEL WITH */}
          <OptionSelector
            title="Who are you traveling with?"
            options={travelWithOptions}
            selected={formData.travelWith}
            onSelect={(value) => handleOptionSelect("travelWith", value)}
          />

          {/* MAP */}
          {coords && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Location Preview:</h3>
              <MapView lat={coords.lat} lon={coords.lon} place={formData.destination} />
            </div>
          )}
        </div>

        <button
          className={`mt-6 mb-10 px-6 py-3 rounded font-bold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Generating Trip..." : "Generate Trip"}
        </button>
      </div>
    </div>
  );
}

export default CreateTrip;
