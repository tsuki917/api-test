const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const pool = require('./db/db');

app.use(express.json());
app.use((req, res, next) => {
    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
        try {
            req.body = JSON.parse(req.body.toString('utf8'));
        } catch (e) {
            return res.status(200).json({ message: 'Invalid JSON' });
        }
    }
    next();
});


app.post("/recipes", async (req, res) => {
    try {
        const { title, making_time, serves, ingredients, cost } = req.body;
        if (!title || !making_time || !serves || !ingredients || !cost) throw new Error("not found params")
        const [result] = await pool.query(
            'insert into recipes (title,making_time,serves,ingredients,cost) values (?,?,?,?,?)', [title, making_time, serves, ingredients, cost]
        )
        const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [result.insertId]);
        res.status(200).json({ message: 'Recipe successfully created!', recipe: rows });
    } catch (err) {
        console.error(err);
        res.status(200).json({
            "message": "Recipe creation failed!",
            "required": "title, making_time, serves, ingredients, cost"
        })
    }
})

app.get("/recipes", async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM recipes');
        res.status(200).json({ recipes: rows });
    } catch (err) {
        res.status(200).json({
            "message": "Recipe creation failed!",
            "required": "title, making_time, serves, ingredients, cost"
        })
    }
})

app.get("/recipes/:id", async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM recipes where id = ?', [req.params.id]);
        res.status(200).json({ recipe: rows[0], message: "Recipe details by id" });
    } catch (err) {
        res.status(200).json({
            "message": "get Recipe id data failed!",
        })
    }
})

app.patch("/recipes/:id", async (req, res) => {
    try {
        const id = req.params.id
        const { title, making_time, serves, ingredients, cost } = req.body;
        const [result] = await pool.query(
            `UPDATE recipes SET
                title = COALESCE(?, title),
                making_time = COALESCE(?, making_time),
                serves = COALESCE(?, serves),
                ingredients = COALESCE(?, ingredients),
                cost = COALESCE(?, cost)
            WHERE id = ?`,
            [title, making_time, serves, ingredients, cost, id]
        );
        const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [id]);
        res.status(200).json({ recipe: rows[0], message: "Recipe successfully updated!" });
    } catch (err) {
        res.status(200).json({
            "message": "Recipe update failed!",
        })
    }
})


app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});