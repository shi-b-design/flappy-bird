const express = require('express');
const pool = require('./db');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Get top 5 scores
app.get('/api/scores', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM high_scores ORDER BY score DESC LIMIT 5'
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
        // await is used because it has to wait the result of "INSERT INTO high_scores(score, player_name)
        // VALUES ($1, $2) RETURNING * "
        // Once it isert the data, it can implement the next operation. 
        const result = await pool.query(
            'INSERT INTO high_scores (score, player_name) VALUES ($1, $2) RETURNING *',
            [score, player_name]
        );
        res.json(result.rows[0]);
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
