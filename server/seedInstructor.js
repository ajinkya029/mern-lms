import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const seedInstructor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "instructor@learnhub.com";
    const password = "LearnHub@123";

    // Check whether instructor already exists
    const existingInstructor = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingInstructor) {
      existingInstructor.name = "LearnHub Instructor";
      existingInstructor.password = hashedPassword;
      existingInstructor.role = "instructor";

      await existingInstructor.save();

      console.log("Existing instructor account updated!");
    } else {
      await User.create({
        name: "LearnHub Instructor",
        email,
        password: hashedPassword,
        role: "instructor",
      });

      console.log("Instructor account created successfully!");
    }

    console.log("--------------------------------");
    console.log("Instructor Login Credentials");
    console.log("--------------------------------");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role: instructor");
    console.log("--------------------------------");
  } catch (error) {
    console.error("Error seeding instructor:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedInstructor();
