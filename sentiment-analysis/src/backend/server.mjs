import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const SECRET_KEY = process.env.JWT_SECRET || "secret_key";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied, token missing or invalid!" });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};

// Signup Endpoint
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const [result] = await db.query(query, [username, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully!", userId: result.insertId });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Error registering user." });
  }
});

// Signin Endpoint
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ email: user.email, userId: user.id }, SECRET_KEY, { expiresIn: "10h" });

    res.status(200).json({ message: "Login successful!", token, avatar: user.avatar });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Error logging in." });
  }
});

// Sentiment Analysis Endpoint
app.post("/api/sentiment", verifyToken, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await axios.post('http://localhost:5001/api/sentiment', { text });

    const { sentiment, message } = response.data;

    const query = `
      INSERT INTO sentiment_results (user_id, text, sentiment) 
      VALUES (?, ?, ?)
    `;
    const values = [req.user.userId, message, sentiment];

    const [result] = await db.query(query, values);
    console.log("Database Insert Result:", result);

    res.json({
      sentiment,
      message,
    });
  } catch (error) {
    console.error("Error during sentiment analysis:", error.message);
    res.status(500).json({ error: "Failed to analyze sentiment." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
