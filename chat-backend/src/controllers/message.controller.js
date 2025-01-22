import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getSidebarUsers = async (req, res) => {
  try {
    const loggedinUserId = await req.user._id;
    const sidebarUsers = await User.find({
      _id: { $ne: loggedinUserId },
    }).select("-password");

    return res.status(201).json({
      sidebarUsers: sidebarUsers,
    });
  } catch (error) {
    console.log("Error in getSidebarUsers Controller: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const userToChatId = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: userToChatId, receiverId: senderId },
        { senderId: senderId, receiverId: userToChatId },
      ],
    });
    return res.status(201).json(messages);
  } catch (error) {
    console.log("Error in getMessagesByUserId Controller: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
