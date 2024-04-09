"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "./action";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  function clearChat() {
    setMessages([]);
  }
  return (
    <div className="">
      <div>
        {
          <div className="flex flex-col gap-5 p-5 w-full max-w-3xl mx-auto pb-[95px] p">
            {messages.length === 0 ? (
              <div className="my-10">
                <div className="text-3xl">Hi! How can I help you today?</div>
                <div className=" text-xl font-thin">
                  say something like &quot;give me flight info for AA 200&quot;
                  to generate UI elements.
                </div>
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-primary capitalize"
                  onClick={() => clearChat()}
                >
                  clear chat
                </button>
              </div>
            )}
            {messages.map(
              (message: { id: number; role: any; display: JSX.Element }) => (
                <div key={message.id}>
                  {message.role === "user" ? (
                    <div className="chat chat-end">
                      <div className="chat-bubble">{message.display}</div>
                    </div>
                  ) : (
                    <div className="chat chat-start">
                      <div className="chat-bubble">{message.display}</div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        }
      </div>

      <form
        className="fixed bottom-0 w-full"
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
        <div className="bg-base-300 flex justify-center p-5">
          <input
            autoFocus
            className="input input-bordered w-full max-w-3xl mx-auto"
            placeholder="Send a message..."
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
          />
        </div>
      </form>
    </div>
  );
}
