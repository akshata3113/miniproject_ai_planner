import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    destination: String,
    days: Number,
    budget: String,
    travelWith: String,
    result: Object,
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
