import mongoose from "mongoose";
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: "10 min" },
  videoUrl: { type: String, default: "" },
  content: { type: String, default: "" },
});
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    description: { type: String, required: true },
    category: { type: String, default: "General" },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail: { type: String, default: "" },
    price: { type: Number, default: 0 },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessons: [lessonSchema],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);
export default mongoose.model("Course", courseSchema);
