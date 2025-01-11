import React from 'react';

export const ChatInput = ({ inputRef, onSend, onKeyDown, disabled }) => (
  <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
    <input
      className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
      placeholder="Type message..."
      ref={inputRef}
      onKeyDown={onKeyDown}
    />
    <button
      disabled={disabled}
      onClick={onSend}
      className={`bg-blue-400 hover:bg-blue-500 text-white p-4 px-10 font-semibold uppercase rounded-md focus:ring-4 focus:ring-blue-300 shadow-lg shadow-blue-400/50 ${
        disabled ? "cursor-not-allowed opacity-30" : ""
      }`}
    >
      Send
    </button>
  </div>
);