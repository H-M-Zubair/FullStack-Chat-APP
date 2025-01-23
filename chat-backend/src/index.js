import express from "express";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { dbConnection } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.routes.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); //to allow parsing limit 5mb by default it is 100KB

const port = 5001;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
  dbConnection();
});
