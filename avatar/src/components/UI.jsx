import React, { useRef } from 'react';
import { useChat } from "../hooks/useChat";
import { useAvatar } from "../hooks/useAvatar";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { Header } from "./Header";
import { ChatInput } from "./ChatInput";
import { ChatButton } from "./UI/ChatButton";

export const UI = ({ hidden }) => {
  const input = useRef();
  const { chat, loading, message } = useChat();
  const { showAvatar, setShowAvatar } = useAvatar();
  
  useKeyboardControls();

  const sendMessage = () => {
    const text = input.current?.value;
    if (text && !loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {showAvatar ? (
        <div className="w-[75%] h-[75%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between">
          <Header onClose={() => setShowAvatar(false)} />
          <ChatInput 
            inputRef={input}
            onSend={sendMessage}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading || message}
          />
        </div>
      ) : (
        <ChatButton onClick={() => setShowAvatar(true)} />
      )}
    </div>
  );
}