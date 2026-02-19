import { Message } from "@/hooks/useChat";
import { Bot, User, Zap } from "lucide-react";
import Image from "next/image";

export const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start space-x-3 max-w-3xl ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-gradient-to-r from-green-500 to-blue-500" : ""
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/jagabot_logo.png"
                alt="Jagantara Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`rounded-lg p-4 ${
            isUser
              ? "bg-[image:var(--gradient-accent-soft)]"
              : "bg-white border border-gray-200 text-gray-900"
          }`}
        >
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* Tool Call Display */}
          {message.toolCall && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Tool Used: {message.toolCall.name}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(message.toolCall.arguments, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`mt-2 text-xs ${isUser ? "text-green-100" : "text-gray-500"}`}
          >
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
