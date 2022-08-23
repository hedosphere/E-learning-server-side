import mongoose from "mongoose";

const markCompleted = new mongoose.Schema(
  {
    course: { type: mongoose.ObjectId, ref: "Course" },
    user: { type: mongoose.ObjectId, ref: "User" },
    lessons: [],
  },
  { timestamps: true }
);

export default mongoose.model("Complete", markCompleted);
