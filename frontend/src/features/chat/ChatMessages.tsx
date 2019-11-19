import React from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";

interface Props {
  messages: Array<string>;
}

export const ChatMessages: React.FC<Props> = ({ messages }) => {
  return (
    <div className="bg-white border rounded max-w-md p-2 h-32 overflow-y-auto">
      {messages.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  );
};
export default ChatMessages;
