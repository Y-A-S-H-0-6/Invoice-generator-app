import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Clerk middleware
app.use(clerkMiddleware());

// MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/invoicedb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Use routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
