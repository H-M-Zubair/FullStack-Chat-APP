import joi from "joi";
import jwt from "jsonwebtoken";
export const authSchema = joi.object({
  fullName: joi.string().min(3).required().messages({
    "string.min": "Full Name should be at least of 4 characters",
    "any.required": "Full Name is required",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: joi.string().min(6).messages({
    "any.required": "Password is required",
    "string.min": "password should be at least of 6 characters",
  }),
});

export const generateToken = (userId, res) => {
  console.log(" Function is called and User Id is: ", userId);
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "7d",
  });
  //Sending into cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //in milli seconds
    httpOnly: true, //prevent XSS attacks and cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
