const express = require('express');
const axios = require('axios');
const router = express.Router();
const ORS_KEY = process.env.ORS_KEY;

if (!ORS_KEY) console.warn('Warning: ORS_KEY not configured - routing may fail.');

router.post('/', async (req, res) => {
  try {
    const { start, end, profile = 'driving-car' } = req.body;
    if (!start || !end) return res.status(400).json({ error: 'start & end required' });
    // start and end are [lng, lat]
    const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
    const data = { coordinates: [[start[0], start[1]], [end[0], end[1]]] };
    const r = await axios.post(url, data, {
      headers: {
        Authorization: ORS_KEY,
        'Content-Type': 'application/json'
      }
    });
    res.json(r.data);
  } catch (err) {
    console.error('route error', err.response?.data || err.message || err);
    res.status(500).json({ error: 'routing failed', details: err.response?.data || err.message });
  }
});

module.exports = router;
