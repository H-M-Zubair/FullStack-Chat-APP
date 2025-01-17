import express from "express";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { dbConnection } from "./lib/db.js";
dotenv.config();
const app = express();

const port = 5001;
app.use("/api/auth", authRouter);

dbConnection().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
  });
});
