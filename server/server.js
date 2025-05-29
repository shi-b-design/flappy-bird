const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Get top score
app.get('/api/scores', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM high_scores ORDER BY score DESC LIMIT 1'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new score
app.post('/api/scores', async (req, res) => {
    try {
        const { score, player_name } = req.body;
        
        const insertResult = await pool.query(
            'INSERT INTO high_scores (score, player_name) VALUES ($1, $2) RETURNING *',
            [score, player_name]
        );
        
        // Get the highest score after inserting
        const highScoreResult = await pool.query(
            'SELECT * FROM high_scores ORDER BY score DESC LIMIT 1'
        );
        
        return res.json(highScoreResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
