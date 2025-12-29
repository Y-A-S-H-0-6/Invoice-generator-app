import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  amount: Number,
  description: String,
  total: Number,
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  clerkId: { type: String, required: true }, // Clerk user id
  title: String,
  billing: Object,
  shipping: Object,
  invoice: Object,
  account: Object,
  company: Object,
  tax: Number,
  notes: String,
  items: [itemSchema],
  logo: String,
  thumbnailUrl: String,
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
