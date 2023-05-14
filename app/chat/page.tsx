"use client";

import openai, { Configuration, OpenAIApi } from "openai";
import React from "react";

type Props = {};

const Chat = (props: Props) => {
  const [messagesRequest, setMessagesRequest] = React.useState<openai.ChatCompletionRequestMessage[]>([]);
  const [messagesResponse, setMessagesResponse] = React.useState<openai.ChatCompletionResponseMessage[]>([]);
  const [messageText, setMessageText] = React.useState<string>("");

  const appendMessageToRequest = (message: openai.ChatCompletionRequestMessage) => {
    setMessagesRequest([...messagesRequest, message]);
  }

  const handleTextCompletion = async (text: string) => {
    try {

      setMessagesRequest([...messagesRequest, {
        role: "user",
        content: text,
       }]);

       setMessageText("");

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
  
      const openaiWithConfig = new OpenAIApi(configuration);
  
      const response = await openaiWithConfig.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messagesRequest,
        temperature: 0.7,
      })

      console.log("response: ", response);
  
      setMessagesRequest([...messagesRequest, {
        role: "assistant",
        // content: response.data.choices[0].message,
        content: response.data.choices[0].message?.content as string,
      }]);

    } catch (error: any) {
      console.log("Failed to complete text, message: ", error.message);
    }

  }

  return (
    <div className="flex flex-col">

      <div className="flex flex-col">
        { messagesRequest.map((message: openai.ChatCompletionRequestMessage, index: number) => {
          return (
            <span className="p-6" key={index}>{message.content}</span>
          )
        })}
      </div>

      <input
        type="text"
        value={messageText}
        onChange={(e) => {
          setMessageText(e.target.value as string);
        }}
        className="border-2 border-black"
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            await handleTextCompletion(messageText);
          }
        }}
      />

    </div>
  );
};

export default Chat;
