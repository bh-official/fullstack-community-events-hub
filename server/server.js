import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN, 
  ssl: { rejectUnauthorized: false }
});

// Testing from route
app.get("/", (req, res) => {
  res.send("Hi there!");
});


// GET all events (our client needs this)
app.get("/events", async (req, res) => {
  const result = await db.query("SELECT * FROM events ORDER BY event_date");
  res.json(result.rows);
});

// POST new event (our form needs this)
app.post("/events", async (req, res) => {
  const { event_name, location, event_date, start_time, end_time, description } =
    req.body;

  await db.query(
    `INSERT INTO events 
     (event_name, location, event_date, start_time, end_time, description, attending_users)
     VALUES ($1,$2,$3,$4,$5,$6,'')`,
    [event_name, location, event_date, start_time, end_time, description]
  );

  res.json({ message: "Event added successfully" });
});

// Mark attending (our button needs this)
app.post("/events/:id/attend", async (req, res) => {
  const eventId = req.params.id;
  const userId = "99"; // later replace with real user login

  const check = await db.query(
    "SELECT attending_users FROM events WHERE id = $1",
    [eventId]
  );

  let attending = check.rows[0].attending_users || "";

  if (!attending.includes(userId)) {
    attending = attending
      ? attending + "," + userId
      : userId;

    await db.query(
      "UPDATE events SET attending_users = $1 WHERE id = $2",
      [attending, eventId]
    );
  }

  res.json({ message: "You're marked as attending! 🎉" });
});

app.listen(4040, () => {
  console.log("Server running on http://localhost:4040");
});