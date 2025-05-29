import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MessageListItem from "./MessageListItem";

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const socket = useSelector((state) => state?.user?.socket);

  // Get chats from DB
  const getConversations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/conversations`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConversations(response?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConversations();
  }, [socket]);

  return (
    <menu className="messageList">
      <h3>Recent Messages</h3>
      {conversations?.length < 1 ? (
        <p>No conversations yet</p>
      ) : (
        conversations.map((conversation) => (
          <MessageListItem
            key={conversation?._id}
            conversation={conversation}
          />
        ))
      )}
    </menu>
  );
};

export default MessageList;
