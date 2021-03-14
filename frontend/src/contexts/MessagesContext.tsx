import React, { useState } from 'react';
import { ChatMessage } from "elixir-backend";

const MessagesContext = React.createContext<Array<ChatMessage> | null>(null)
const SetMessagesContext = React.createContext<any | null>(null)


function MessagesProvider({children} : any) {
  const [messages, setMessages] = useState<Array<ChatMessage> | null>(null);
  return (
    <MessagesContext.Provider value={messages}>
      <SetMessagesContext.Provider value={setMessages}>
        {children}
      </SetMessagesContext.Provider>
    </MessagesContext.Provider>
  )
}

function useMessages() {
  const context = React.useContext(MessagesContext)
  if (context === undefined) {
    throw new Error('messages must be used within a messagesProvider')
  }
  return context
}

function useSetMessages() {
  const context = React.useContext(SetMessagesContext)
  if (context === undefined) {
    throw new Error('setMessages must be used within a messagesProvider')
  }
  return context
}

export {MessagesProvider, useMessages, useSetMessages}