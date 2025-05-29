const HttpError = require("../models/errorModel");
const MessageModel = require("../models/messageModel");
const conversationModel = require("../models/conversationModel");
const { text } = require("express");
const { getReceiverSocketId, io } = require("../socket.io/socket");

///==================CREATE MESSAGE
const createMessage = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const { messageBody } = req.body;
    //check there is already a conversation between the two users
    let conversation = await conversationModel.findOne({
      participants: {
        $all: [req.user.id, receiverId],
      },
    });

    //create a new conversation if there is no conversation
    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [req.user.id, receiverId],
        lastMessage: { text: messageBody },
        senderId: req.user.id,
      });
    }

    //create a new message
    const newMessage = await MessageModel.create({
      conversationId: conversation._id,
      senderId: req.user.id,
      text: messageBody,
    });

    await conversation.updateOne({
      lastMessage: { text: messageBody, senderId: req.user.id },
    });

    res.json(newMessage);

    const recieverSocketId = getReceiverSocketId(receiverId);
    if(recieverSocketId) {
      const io = require("../socket.io/socket").io;
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

///==================get MESSAGE
const getMessages = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const conversation = await conversationModel.findOne({
      participants: {
        $all: [req.user.id, receiverId],
      },
    });

    if (!conversation) {
      return next(new HttpError("No conversation found", 404));
    }

    const messages = await MessageModel.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    return next(new HttpError(error));
  }
};

///==================GET CONVERSATON
const getConversation = async (req, res, next) => {
  try {
    let conversations = await conversationModel
      .find({ participants: req.user.id })
      .populate({ path: "participants", select: "fullName profilePhoto" })
      .sort({ createdAt: -1 });

    //remove logged in user from participants
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== req.user.id.toString()
      );
    });

    res.json(conversations);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createMessage,
  getMessages,
  getConversation,
};
