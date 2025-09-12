// models/Budget.js
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true }, // e.g. Food, Travel
  amount: { type: Number, required: true },   // limit for the category
  month: { type: Number, required: true },    // 1-12
  year: { type: Number, required: true },     // e.g. 2025
}, { timestamps: true });

export default mongoose.model("Budget", budgetSchema);
