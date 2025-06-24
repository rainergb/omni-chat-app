// src/components/chatpage/Chatpage.tsx
import React from "react";
import { ChatLayout } from "./components/ChatLayout/ChatLayout";

export const Chatpage: React.FC = () => {
  return (
    <div style={{ height: "100%", width: "100%", minHeight: "100%" }}>
      <ChatLayout />
    </div>
  );
};