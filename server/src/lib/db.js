import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { config } from "../configs/config.js";

export const connectDb = async () => {
  try {
    logger.start("Connecting to MongoDB..");
    await mongoose.connect(config.DB_URI, {
      ssl: true,
    });

    logger.success("MongoDB connected");
  } catch (error) {
    logger.error(
      "Error connecting to the database. Please check your DB_URI configuration.",
      error
    );
    process.exit(1);
  }
};
