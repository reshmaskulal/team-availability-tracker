
const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

const db = new Database("team.db");

db.exec(`
CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available'
);
`);

const count = db.prepare("SELECT COUNT(*) AS count FROM team_members").get().count;

if (count === 0) {
    const insert = db.prepare(
        "INSERT INTO team_members (name, role, status) VALUES (?, ?, ?)"
    );

    insert.run("Alice", "Developer", "Available");
    insert.run("Bob", "Designer", "Busy");
    insert.run("Charlie", "Tester", "Away");
    insert.run("David", "Project Manager", "Available");
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/team", (req, res) => {
    const members = db.prepare("SELECT * FROM team_members").all();
    res.json(members);
});

app.put("/api/team/:id/status", (req, res) => {
    const { status } = req.body;

    const allowedStatuses = ["Available", "Busy", "Away"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    const result = db.prepare(
        "UPDATE team_members SET status = ? WHERE id = ?"
    ).run(status, req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: "Team member not found" });
    }

    const member = db.prepare(
        "SELECT * FROM team_members WHERE id = ?"
    ).get(req.params.id);

    res.json(member);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
