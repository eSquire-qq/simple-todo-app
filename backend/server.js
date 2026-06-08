require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Отримати всі задачі
app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });
});

// Додати задачу
app.post("/todos", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  db.run(
    "INSERT INTO todos (title) VALUES (?)",
    [title],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        id: this.lastID,
        title,
      });
    }
  );
});

// Видалити задачу
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/info", (req, res) => {
  res.json({
    app: "simple-todo-app",
    version: "1.0.0",
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
