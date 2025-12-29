import express from "express";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// POST /api/users
router.post("/", requireAuth(), async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, photoUrl } = req.body;

    // You can save the user in your database here
    // Example:
    // await User.create({ clerkId, email, firstName, lastName, photoUrl });

    res.status(201).json({ message: "User synced successfully" });
  } catch (err) {
    console.error("User sync error:", err);
    res.status(500).json({ error: "User sync failed" });
  }
});

export default router;
