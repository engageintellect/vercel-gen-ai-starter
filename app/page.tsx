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
          <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto pb-[95px]">
            {messages.length === 0 ? (
              <div className="p-5 py-10">
                <div className="text-3xl">Hello! How can I help you today?</div>
                <div className=" text-xl font-thin">
                  say something like &quot;give me flight info for AA 200&quot;
                  to generate UI elements.
                </div>
              </div>
            ) : (
              <div className="sticky top-0 -z-[-1] p-5">
                <button
                  className="btn btn-primary capitalize shadow outline outline-base-100"
                  onClick={() => clearChat()}
                >
                  clear chat
                </button>
              </div>
            )}
            {messages.map(
              (message: { id: number; role: any; display: JSX.Element }) => (
                <div className="px-5" key={message.id}>
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
