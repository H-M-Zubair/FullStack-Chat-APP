import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";
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
    const userToChatId = req.params.id;
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

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    console.log("sender ID: ", senderId, "receiver ID: ", receiverId);
    const { image, text } = req.body;

    let imageUrl;
    if (image) {
      const uploadImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    //Real time Message send if both are online
    const receiverSocketId = getReceiverSocketId(receiverId); //Getting receiver socket id from
    console.log("receiver Socket ID: ", receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); //Send new message "newMessage" could be name anything
    }
    return res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
