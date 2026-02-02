const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const router = express.Router();

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache
const MAPTILER_KEY = process.env.MAPTILER_KEY || '';

/**
 * GET /api/geocode/search?q=...
 * Uses MapTiler geocoding if key present; otherwise Nominatim
 */
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'q required' });

  const cacheKey = `search:${q}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    if (MAPTILER_KEY) {
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${MAPTILER_KEY}&limit=8`;
      const r = await axios.get(url);
      cache.set(cacheKey, r.data);
      return res.json(r.data);
    } else {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=8`;
      const r = await axios.get(url, { headers: { 'User-Agent': 'MERN-maps-app/1.0' }});
      cache.set(cacheKey, r.data);
      return res.json(r.data);
    }
  } catch (err) {
    console.error('geocode search error', err.response?.data || err.message || err);
    res.status(500).json({ error: 'geocoding failed' });
  }
});

/**
 * GET /api/geocode/reverse?lat=...&lon=...
 */
router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat & lon required' });

  const cacheKey = `reverse:${lat}:${lon}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json&addressdetails=1`;
    const r = await axios.get(url, { headers: { 'User-Agent': 'MERN-maps-app/1.0' }});
    cache.set(cacheKey, r.data);
    res.json(r.data);
  } catch (err) {
    console.error('reverse geocode error', err.response?.data || err.message || err);
    res.status(500).json({ error: 'reverse geocode failed' });
  }
});

module.exports = router;
