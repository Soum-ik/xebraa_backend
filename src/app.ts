import hpp from "hpp";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import routers from "./app/routes";
import sendResponse from "./app/utils/sendResponse";
import globalError from "./app/middlewares/globalError";
import { initializeSocket } from "./app/socket/socket-server";
import config from "./app/config";

const app: Application = express();
const httpServer = http.createServer(app);

// Initialize Socket Server
initializeSocket(httpServer);

// Middleware Setup
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
  exposedHeaders: ["x-timezone"],
  allowedHeaders: ["Content-Type", "Authorization", "x-timezone"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());
// app.use(hpp());

// Routes
app.use("/api", routers);

app.get("/", async (req: Request, res: Response) => {
  res.send({ time: new Date() });
});

// Handle CORS headers for unsupported routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


// Global Error Handler
app.use(globalError);

export default httpServer;
