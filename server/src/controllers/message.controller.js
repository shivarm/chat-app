import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { logger } from "../utils/logger.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    logger.error("Error in fetching users", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/*Get messages between two users*/
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    logger.error("Error in fetching messages", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message text or image is required." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    res.status(201).json(newMessage);

    //TODO: Integrare socket.io for realtime data
  } catch (error) {
    logger.error("Error in sending message", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
