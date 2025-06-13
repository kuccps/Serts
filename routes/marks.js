const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { name, subject, marks } = req.body;
  try {
    await pool.query('INSERT INTO marks (name, subject, marks) VALUES ($1, $2, $3)', [name, subject, marks]);
    res.json({ message: 'Marks saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
