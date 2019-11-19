import React from "react";
//import React, { useState, useEffect, useContext } from "react";
//import cx from "classnames";

interface Props {
  messages: Array<string>;
}

export const ChatMessagesInner: React.FC<Props> = ({ messages }) => {
  return (
    <>
      {messages.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </>
  );
};
export default ChatMessagesInner;
