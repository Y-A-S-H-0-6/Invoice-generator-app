import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import Invoice from "../models/invoice.js";
import { requireAuth, getAuth } from "@clerk/express";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create Invoice
router.post("/", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const payload = { clerkId: userId, ...req.body };
    const invoice = await Invoice.create(payload);
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
 
// Get Invoices
router.get("/", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const invoices = await Invoice.find({ clerkId: userId }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Invoice
router.put("/:id", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const inv = await Invoice.findById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });
    if (inv.clerkId !== userId) return res.status(403).json({ error: "Forbidden" });

    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Invoice
router.delete("/:id", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const inv = await Invoice.findById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });
    if (inv.clerkId !== userId) return res.status(403).json({ error: "Forbidden" });

    await Invoice.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Send Invoice (email)
router.post("/sendinvoice", requireAuth(), upload.single("file"), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !req.file) return res.status(400).json({ error: "Missing data" });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Invoice from your app",
      text: "Please find attached invoice.",
      attachments: [{ filename: req.file.originalname || "invoice.pdf", content: req.file.buffer }],
    });

    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
