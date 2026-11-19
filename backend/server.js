const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 8080;

// PostgreSQL connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'coy',
  user: 'postgres',
  password: 'admin@123',
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// The logged-in user ID (single-user mode as per assignment)
const CURRENT_USER_ID = 1;

// ──────────────────────────────────────────────
// GET /feed — profiles the user has NOT swiped on
// ──────────────────────────────────────────────
app.get('/feed', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.age, p.photo, p.bio, p.city, p.college, p.interests
       FROM profiles p
       WHERE p.id != $1
         AND p.id NOT IN (
           SELECT target_id FROM swipes WHERE swiper_id = $1
         )
       ORDER BY p.id`,
      [CURRENT_USER_ID]
    );
    res.json({ profiles: result.rows });
  } catch (err) {
    console.error('GET /feed error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ──────────────────────────────────────────────
// POST /swipe — record like/pass, detect match
// ──────────────────────────────────────────────
app.post('/swipe', async (req, res) => {
  const { targetId, action } = req.body; // action: 'like' | 'pass'

  if (!targetId || !['like', 'pass'].includes(action)) {
    return res.status(400).json({ error: 'targetId and action (like|pass) are required' });
  }

  try {
    // Insert swipe
    await pool.query(
      `INSERT INTO swipes (swiper_id, target_id, action)
       VALUES ($1, $2, $3)
       ON CONFLICT (swiper_id, target_id) DO NOTHING`,
      [CURRENT_USER_ID, targetId, action]
    );

    let matched = false;
    let matchedProfile = null;

    if (action === 'like') {
      // Check if the target has also liked the current user
      const mutual = await pool.query(
        `SELECT 1 FROM swipes
         WHERE swiper_id = $1 AND target_id = $2 AND action = 'like'`,
        [targetId, CURRENT_USER_ID]
      );

      if (mutual.rows.length > 0) {
        // Insert match (both directions)
        await pool.query(
          `INSERT INTO matches (user1_id, user2_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [Math.min(CURRENT_USER_ID, targetId), Math.max(CURRENT_USER_ID, targetId)]
        );
        matched = true;

        // Return matched profile data
        const profileResult = await pool.query(
          'SELECT id, name, age, photo, bio, city, college, interests FROM profiles WHERE id = $1',
          [targetId]
        );
        matchedProfile = profileResult.rows[0] || null;
      }
    }

    res.json({ success: true, matched, matchedProfile });
  } catch (err) {
    console.error('POST /swipe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ──────────────────────────────────────────────
// GET /matches — mutual matches for logged-in user
// ──────────────────────────────────────────────
app.get('/matches', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.age, p.photo, p.bio, p.city, p.college, p.interests, m.matched_at
       FROM matches m
       JOIN profiles p ON (
         (m.user1_id = $1 AND p.id = m.user2_id) OR
         (m.user2_id = $1 AND p.id = m.user1_id)
       )
       ORDER BY m.matched_at DESC`,
      [CURRENT_USER_ID]
    );
    res.json({ matches: result.rows });
  } catch (err) {
    console.error('GET /matches error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Coy Backend running on http://localhost:${PORT}`);
});
