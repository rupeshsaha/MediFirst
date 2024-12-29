import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB:", mongoose.connection.name);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
   
  }
};
