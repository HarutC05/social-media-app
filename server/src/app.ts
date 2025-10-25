import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

import apiRoutes from "./routes/api.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api", apiRoutes);

export default app;
