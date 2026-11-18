import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./src/models/Course.js";
import User from "./src/models/User.js";

dotenv.config();

const courses = [
  {
    title: "Complete HTML & CSS",
    description:
      "Learn HTML5 and CSS3 from scratch and build responsive websites.",
    category: "Web Development",
    price: 0,
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
  {
    title: "JavaScript Masterclass",
    description:
      "Master JavaScript fundamentals, ES6+, DOM manipulation and asynchronous programming.",
    category: "Programming",
    price: 499,
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
  },
  {
    title: "React.js for Beginners",
    description:
      "Build modern user interfaces using React, components, hooks and routing.",
    category: "Web Development",
    price: 699,
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
  },
  {
    title: "Node.js & Express.js",
    description:
      "Learn backend development and build REST APIs using Node.js and Express.",
    category: "Backend Development",
    price: 799,
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },
  {
    title: "Complete MERN Stack Development",
    description:
      "Build full-stack applications using MongoDB, Express, React and Node.js.",
    category: "Web Development",
    price: 1499,
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
];

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const instructor = await User.findOne({
      email: "instructor@learnhub.com",
    });

    if (!instructor) {
      throw new Error(
        "Instructor not found. Run npm run seed:instructor first.",
      );
    }

    // Avoid inserting duplicate sample courses
    for (const course of courses) {
      await Course.findOneAndUpdate(
        { title: course.title },
        {
          ...course,
          instructor: instructor._id,
        },
        { upsert: true, new: true, runValidators: true },
      );
    }

    console.log(`${courses.length} sample courses added successfully!`);
  } catch (error) {
    console.error("Course seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedCourses();
