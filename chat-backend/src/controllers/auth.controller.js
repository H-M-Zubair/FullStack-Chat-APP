import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.utils.js";
export const signup = async (req, res) => {
  console.log("THE REQUEST BODY IS ", req.body);
  const { email, fullName, password } = req.body;
  console.log("THE USER DATA IS ", { email, fullName, password });
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password: ", hashedPassword);
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });
    console.log("New User Created: ", newUser);
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        status: "success",
        data: {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
        },
        message: "User has been registered.",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log;
    res.status(500).json({ message: "Server Error" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credentials are invalid" });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credentials are invalid" });
    }
    generateToken(user._id, res);
    return res.status(201).json({
      message: "Login Successfully!",
      userData: user,
    });
  } catch (error) {
    console.log("Error in login Controller: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logout successfully" });
  } catch (error) {
    console.log("Error in Logout Controller: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
