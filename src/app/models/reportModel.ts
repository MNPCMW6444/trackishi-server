import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("report", reportSchema);

export default Report;
