import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/connectDB.ts";
import { AppError } from "./src/utils/AppError.ts";
import authRouter from "./src/routes/auth.route.ts";

dotenv.config();

const app = express();

const port = process.env.PORT || 2000;

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/api/auth", authRouter);

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: error.message });
  res.json({
    message: error.message || "An error occurred",
    status: error.status,
    stack: error.stack,
  });
});

app.listen(port, () => {
  connectDB(process.env.DATABASE_URL || "");
  console.log(`Server is running at http://localhost:${port}`);
});
