"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "./action";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    <div className="max-w-3xl mx-auto p-5">
      <div>
        {
          <div className="flex flex-col gap-5 py-5">
            {messages.map(
              (message: { id: number; role: any; display: JSX.Element }) => (
                <div key={message.id}>
                  {message.role === "user" ? (
                    <div className="chat chat-end">
                      <div className="chat-bubble">{message.display}</div>
                    </div>
                  ) : (
                    <div className="chat chat-start">
                      <div className="chat-bubble chat-bubble">
                        {message.display}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        }

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // Add user message to UI state
            setMessages((currentMessages: typeof messages) => [
              ...currentMessages,
              {
                id: Date.now(),
                role: "user",
                display: <div>{inputValue}</div>,
              },
            ]);

            // Submit and get response message
            const responseMessage = await submitUserMessage(inputValue);
            setMessages((currentMessages: typeof messages) => [
              ...currentMessages,
              responseMessage,
            ]);

            setInputValue("");
          }}
        >
          <input
            className="input input-bordered w-full"
            placeholder="Send a message..."
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
}
