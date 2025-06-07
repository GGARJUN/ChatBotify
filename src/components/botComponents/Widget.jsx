"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { SquareX } from "lucide-react";
import { ChatContainer, ChatForm, ChatMessages } from "../ui/chat";
import { MessageList } from "../ui/message-list";
import { MessageInput } from "../ui/message-input";
import { sendChatMessage } from "@/lib/api/chat"; // ✅ Import the service

export default function Widget({ onClose, botId, botName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Start new request
    abortControllerRef.current = new AbortController();

    try {
      const idToken = localStorage.getItem("idToken");
      if (!idToken) throw new Error("No authentication token found.");

      const payload = {
        query_text: input,
        project_id: botId,
      };

      const data = await sendChatMessage(payload, idToken, abortControllerRef.current.signal);

      const botMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.answer || "Sorry, I couldn't process that request.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Error:", error);
        const errorMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: error.message || "An error occurred. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const append = (message) => {
    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message.content,
    };
    setMessages((prev) => [...prev, newMessage]);
    handleSubmit({ preventDefault: () => {} });
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-[450px] w-[400px] fixed bottom-5 bg-white right-5 rounded-lg border border-gray-200 shadow-lg"
      )}
    >
      {/* Header */}
      <ChatContainer className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center px-3 py-5 border-b border-gray-200 bg-gray-200 rounded-t-lg">
          <h3 className="text-md font-semibold text-blue-700">{botName}</h3>
          <button
            onClick={onClose}
            className="text-gray-900 text-sm"
            aria-label="Close chat"
          >
            <SquareX />
          </button>
        </div>
        <ChatMessages className="grow overflow-y-auto p-3">
          <h2 className="text-center font-bold text-xl">
            Test Your <span className="text-primary">{botName}</span>
          </h2>
          <MessageList messages={messages} isTyping={isLoading} />
        </ChatMessages>

        <div className="p-3">
          <ChatForm className="" isPending={isLoading} handleSubmit={handleSubmit}>
            {({ files, setFiles }) => (
              <MessageInput
                value={input}
                onChange={handleInputChange}
                allowAttachments={false}
                files={files}
                setFiles={setFiles}
                stop={stop}
                isGenerating={isLoading}
                placeholder="Ask a question..."
              />
            )}
          </ChatForm>
        </div>
      </ChatContainer>
    </div>
  );
}