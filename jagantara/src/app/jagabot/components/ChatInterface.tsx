// components/ChatInterface.tsx - Main Chat Component
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useChat, Message } from "@/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import Image from "next/image";

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput("");
  };

  const quickActions = [
    {
      label: "Get NFT Quote",
      query: "Generate a quote for my NFT collection worth $5,000",
    },
    {
      label: "Analyze Contract",
      query:
        "Analyze smart contract 0x1234567890123456789012345678901234567890",
    },
  ];

  return (
    <div className="flex flex-col justify-center">
      {/* Chat Messages */}
      <div className=" overflow-y-auto p-4 h-[72vh]">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center pt-40">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/jagabot_logo.png"
                  alt="Jagantara Logo"
                  width={70}
                  height={70}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Welcome to Jagantara AI Assistant
              </h3>
              <p className="text-[var(--text)]/70 mb-6">
                I can help you with web3 insurance quotes and smart contract
                analysis.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(action.query)}
                    className="px-4 py-2 bg-[var(--secondary)]  rounded-lg text-sm hover:bg-[var(--secondary)]/70 transition-colors cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8  rounded-full flex items-center justify-center">
                <Image
                  src="/jagabot_logo.png"
                  alt="Jagantara Logo"
                  width={50}
                  height={50}
                />
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:fixed bottom-15 left-0 right-0 ">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about insurance quotes, contract analysis, or submit a claim..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none "
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-[image:var(--gradient-third)]  rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
