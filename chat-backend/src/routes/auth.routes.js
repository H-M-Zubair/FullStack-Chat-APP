import { Router } from "express";
import { signin, logout, signup } from "../controllers/auth.controller.js";
import { validateAuth } from "../middlewares/auth.middleware.js";
import { authSchema } from "../utils/auth.utils.js";
const authRouter = Router();

authRouter.post("/signup", validateAuth(authSchema), signup);
authRouter.post("/signin", signin);
authRouter.post("/logout", logout);
export default authRouter;
