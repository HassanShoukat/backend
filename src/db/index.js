import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const mongoURI = `${process.env.MONGODB_URI}/${DB_NAME}`;
    console.log("Attempting to connect to MongoDB...");
    console.log(`Connection URI: ${mongoURI.replace(/:[^:]*@/, ":****@")}`); // Hide password

    const connectionInstance = await mongoose.connect(mongoURI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `\n Connected to MongoDB successfully!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.reason) console.error("Reason:", error.reason);
    process.exit(1);
  }
};

export default connectDB;
