import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../../api/instance";

const ChatContext = createContext();

function SocketContext({ children }) {
  const socket = io(`http://localhost:3000`);

  useEffect(() => {
    if (
      localStorage.getItem("admin-token") &&
      localStorage.getItem("admin-details")
    ) {
      socket.emit("isOnline", { isOnline: true,userId: JSON.parse(localStorage.getItem("admin-details"))?._id});
    }
  }, []);

  const value = {
    socket,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default SocketContext;
