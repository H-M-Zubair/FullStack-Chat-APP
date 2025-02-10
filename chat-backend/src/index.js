import express from "express";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { dbConnection } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.routes.js";
import cors from "cors";
import { server, app } from "./lib/socket.js";
import path from "path";
dotenv.config();

app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); //to allow parsing limit 5mb by default it is 100KB

const port = 5001;
const __dirname = path.resolve();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../chat-frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../chat-frontend/dist/index.html"));
  });
}
server.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
  dbConnection();
});
