import { Router } from "express";
import {
  signin,
  logout,
  signup,
  updateUser,
} from "../controllers/auth.controller.js";
import {
  validateAuth,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { authSchema } from "../utils/auth.utils.js";
const authRouter = Router();

authRouter.post("/signup", validateAuth(authSchema), signup);
authRouter.post("/signin", signin);
authRouter.post("/logout", logout);
authRouter.put("/update-user-data", authMiddleware, updateUser);
export default authRouter;
