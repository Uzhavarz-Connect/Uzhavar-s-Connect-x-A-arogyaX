"use client";
import useAuthContext from "@/hooks/useAuthContext";
import useDataContext from "@/hooks/useDataContext";
import ServerHandler from "@/lib/server-handler";
import { Bot, CircleUser, SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChatView() {
  const data = useDataContext();
  const auth = useAuthContext();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState<string>("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput(""); // Clear input field

    await data.sendDPMessage!;
  };

  return (
    <div className="w-full flex flex-col items-center p-4 h-full">
      <div className="overflow-y-auto w-full mb-4 p-2 rounded flex-grow flex flex-col gap-4 px-[10%] pb-16">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 text-lg rounded-xl max-w-[75%] relative ${
              message.sender === "user"
                ? "bg-blue-300/60 text-right self-end"
                : "bg-zinc-300/50 text-left self-start"
            }`}
          >
            <button
              className={`material-symbols-rounded absolute h-12 w-12 rounded-xl flex items-center justify-center top-0 ${
                message.sender === "user"
                  ? "-right-14 bg-blue-300/60"
                  : "-left-14 bg-blue-800 text-white"
              }`}
            >
              <span className="material-symbols-rounded">
                {message.sender === "user" ? <CircleUser /> : <Bot />}
              </span>
            </button>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center text-lg absolute bottom-2 gap-2 inset-x-0 mx-[15%] pt-4 pb-4 px-4 bg-white/60 rounded-full backdrop-blur-lg">
        <input
          type="text"
          className="flex-1 px-6 py-2 border border-zinc-400 rounded-full focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {/* <div className="relative">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 text-white"
            onClick={() => setIsMediaSelectorOpen((prev) => !prev)}
          >
            <Settings />
          </button>
          <div
            className={`absolute bottom-24 bg-white/30 p-4 rounded-xl ${
              isMediaSelectorOpen ? "" : "hidden"
            }`}
          >
            <MediaDeviceSelector
              onSelect={(ms) => {
                audioRecorder.initialize(ms, async (audio: string) => {
                  ServerHandler.getTextFromSpeech(audio).then((text) =>
                    setInput(text)
                  );
                });
                setIsMediaSelectorOpen(false);
              }}
              type="audio"
            />
          </div>
        </div> */}
        {/* <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 text-white"
          onClick={() => {
            if (isRecording) audioRecorder.stopRecording();
            else audioRecorder.startRecording();
            setIsRecording((prev) => !prev);
          }}
        >
          {isRecording ? <CircleStop /> : <Mic />}
        </button> */}
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 text-white"
          onClick={handleSendMessage}
        >
          <SendHorizonal />
        </button>
      </div>
    </div>
  );
}
