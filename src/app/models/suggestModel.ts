import mongoose from "mongoose";

const suggestSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Suggest = mongoose.model("suggest", suggestSchema);

export default Suggest;
