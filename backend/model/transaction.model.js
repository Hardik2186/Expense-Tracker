// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true }, // e.g. "Grocery shopping"
  amount: { type: Number, required: true }, // positive=income, negative=expense
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true }, // Food, Salary, Bills...
  mode: { type: String, enum: ["Cash", "Online", "UPI", "Card", "Bank Transfer"], required: true },
  payee: { type: String, required: true }, // e.g. Amazon, Ramesh
  description: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
