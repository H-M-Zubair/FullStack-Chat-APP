import express from "express";
import { Router } from "express";
import {
  getMessagesByUserId,
  getSidebarUsers,
  sendMessage,
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const messageRouter = Router();

messageRouter.get("/get-sidebar-users", authMiddleware, getSidebarUsers);

messageRouter.get(
  "/get-messages-by-userId/:id",
  authMiddleware,
  getMessagesByUserId
);
export default messageRouter;
