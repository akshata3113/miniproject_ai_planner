const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

if (!GEOAPIFY_KEY) console.warn('Warning: GEOAPIFY_KEY not configured - places search will fail.');

router.get('/nearby', async (req, res) => {
  const { lat, lon, radius = 1000, category = 'catering.restaurant' } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat & lon required' });
  if (!GEOAPIFY_KEY) return res.status(500).json({ error: 'GEOAPIFY_KEY not configured' });

  try {
    // Geoapify categories can be like "catering.restaurant" or "tourism.hotel"
    const filter = `circle:${lon},${lat},${radius}`;
    const url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(category)}&filter=${filter}&limit=40&apiKey=${GEOAPIFY_KEY}`;
    const r = await axios.get(url);
    res.json(r.data);
  } catch (err) {
    console.error('places error', err.response?.data || err.message || err);
    res.status(500).json({ error: 'places search failed' });
  }
});

module.exports = router;
