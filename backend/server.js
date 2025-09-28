import express from "express";
import connectDb from "./config/connectDb.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geminiResponse from "./gemini.js";

dotenv.config();
await connectDb();
const app = express();
app.use(
  cors({
    origin: "https://ai-virtual-agent-frontend.onrender.com",
    credentials: true,
  })
);

// middleware
app.use(express.json());

// routes

app.use(cookieParser());
app.use("/api/user", authRoutes);
app.use("/api/person", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
