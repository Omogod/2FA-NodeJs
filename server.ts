import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./utils/prisma";
import authRouter from "./routes/auth.route";

export const prisma = new PrismaClient();
const app = express();

async function main() {
  // Middleware
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );
  app.use(express.json());

  //   Health Checker
  app.get("/api/healthchecker", (req: Request, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to Two-Factor Authentication with Node.js",
    });
  });

  app.use("/api/auth", authRouter);
  // Register the API Routes

  // Catch All
  app.all("*", (req: Request, res: Response) => {
    return res.status(404).json({
      status: "fail",
      message: `Route: ${req.originalUrl} not found`,
    });
  });

  const PORT = 8000;
  app.listen(PORT, () => {
    console.info(`Server started on port: ${PORT}`);
    connectDB();
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
