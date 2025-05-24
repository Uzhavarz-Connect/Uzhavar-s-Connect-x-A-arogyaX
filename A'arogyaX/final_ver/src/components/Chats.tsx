"use client";
import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "@/contexts/DataContext";
import useDataContext from "@/hooks/useDataContext";

interface ChatMessage {
  sender: string;
  message: string;
  doctorId?: string;
}

interface ChatsProps {
  currUserId: number;
  otherUserId: number;
  currRole: "doctor" | "patient";
}

const Chats: React.FC<ChatsProps> = ({ currUserId, otherUserId, currRole }) => {
  const { getMessagesByUserId, sendDPMessage } = useDataContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const data = await getMessagesByUserId(currUserId, otherUserId, currRole);
      if (data) setMessages(data);
    };

    loadMessages();
  }, [currUserId, otherUserId, currRole, getMessagesByUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await sendDPMessage(currUserId, otherUserId, currRole, newMessage);

    const updated = await getMessagesByUserId(
      currUserId,
      otherUserId,
      currRole
    );
    if (updated) setMessages(updated);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => {
          const isSender = msg.sender.toLowerCase() === currRole.toLowerCase();

          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-xs text-sm shadow-md ${
                  isSender
                    ? "bg-green-200 text-black rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <div>{msg.message}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 flex items-center bg-gray-50">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring"
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chats;
