import joi from "joi";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const validateAuth = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //this "jwt" is the token name through which name i stored the token
    if (!token) {
      res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }
    const decoded_details = await jwt.verify(token, process.env.JWT_KEY);
    if (!decoded_details) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    const user = await User.findById(decoded_details.userId).select(
      "-password"
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth-Middleware Protected Route: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
