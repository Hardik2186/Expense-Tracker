// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, // e.g. Food, Travel
  type: { type: String, enum: ["income", "expense"], required: true },
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
