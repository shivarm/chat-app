import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
 
import { config } from "./configs/config.js";
import { connectDb } from "./lib/db.js";
import { logger } from "./utils/logger.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

 
const PORT = config.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong",
    status: error.status,
    stack: error.stack,
  });
});

app.listen(PORT, async (error) => {
  if (error) {
    throw error;
  }
  await connectDb();
  logger.info(`Application running on ${PORT}`);
});
