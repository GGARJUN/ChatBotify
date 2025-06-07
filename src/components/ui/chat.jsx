import { FC, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Message } from "ai/react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, X } from "lucide-react";
import { ScrollArea } from "./scroll-area";



export const ChatContainer = ({ children, className }) => (
  <div className={cn("flex flex-col h-full w-full bg-background rounded-lg", className)}>
    {children}
  </div>
);



export const ChatMessages = ({ children, className }) => (
  <ScrollArea className={cn("flex-1 mb-0", className)}>
    {children}
  </ScrollArea>
);



export const MessageList = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "p-3 rounded-lg max-w-[80%]",
            msg.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted"
          )}
        >
          {msg.content}
        </div>
      ))}
      {isTyping && (
        <div className="p-3 rounded-lg max-w-[80%] mr-auto bg-muted">
          <span className="typing-indicator">Typing</span>
          <style jsx>{`
    .typing-indicator::after {
      content: '...';
      display: inline-block;
      width: 1.5em;
      text-align: left;
      animation: ellipsis 1.5s infinite;
    }

    @keyframes ellipsis {
      0% { content: '.'; }
      33% { content: '..'; }
      66% { content: '...'; }
    }
  `}</style>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};



export const PromptSuggestions= ({ append, suggestions }) => (
  <div className="flex flex-col items-center justify-center flex-1">
    <p className="text-muted-foreground mb-4">Try these suggestions:</p>
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, i) => (
        <Button
          key={i}
          variant="outline"
          onClick={() => append({ content: suggestion })}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  </div>
);



export const ChatForm = ({ className, isPending, handleSubmit, children }) => {
  const [files, setFiles] = useState([]);

  return (
    <form
      className={cn("flex items-center gap-2", className)}
      onSubmit={handleSubmit}
    >
      {children({ files, setFiles })}
    </form>
  );
};



export const MessageInput = ({
  value,
  onChange,
  allowAttachments,
  files,
  setFiles,
  stop,
  isGenerating,
  placeholder,
}) => (
  <div className="flex items-center gap-2 w-full">
    {allowAttachments && (
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Paperclip className="w-5 h-5" />
      </Button>
    )}
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Type your message..."}
      className="flex-1"
      disabled={isGenerating}
    />
    {isGenerating ? (
      <Button variant="outline" onClick={stop}>
        <X className="w-5 h-5" />
      </Button>
    ) : (
      <Button type="submit">Send</Button>
    )}
    {allowAttachments && (
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
        multiple
      />
    )}
  </div>
);