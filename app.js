const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const pool = require('./db/db');

app.use((req, res, next) => {
    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
        try {
            req.body = JSON.parse(req.body.toString('utf8'));
        } catch (e) {
            return res.status(400).json({ message: 'Invalid JSON' });
        }
    }
    next();
});


app.post("/recipes", async (req, res) => {
    const { title, making_time, serves, ingredients, cost } = req.body;
    try {
        const [result] = await pool.query(
            'insert into recipes (title,making_time,serves,ingredients,cost) values (?,?,?,?,?)', [title, making_time, serves, ingredients, cost]
        )
        const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [result.insertId]);
        res.status(200).json({ message: 'Recipe successfully created!', recipe: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            "message": "Recipe creation failed!",
            "required": "title, making_time, serves, ingredients, cost"
        })
    }
})

app.get("/recipes", async (req, res) => {
    try {
        const [result] = await pool.query(
            'insert into recipes (title,making_time,serves,ingredients,cost) values (?,?,?,?,?)', [title, making_time, serves, ingredients, cost]
        )
        const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [result.insertId]);
        res.status(200).json({ message: 'Recipe successfully created!', recipes: [rows] });
    } catch (err) {
        res.status(500).json({
            "message": "Recipe creation failed!",
            "required": "title, making_time, serves, ingredients, cost"
        })
    }
})


app.use((req, res) => {
    res.status(404);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});