import React, { useRef } from "react";
import ChatLine from "./ChatLine";
import { useMessages } from "../../contexts/MessagesContext";

interface Props {
  className?: string;
}

export const ChatMessages: React.FC<Props> = ({ className }) => {
  console.log("rendering chatmessages")
  const messages = useMessages();

  const bottomRef = useRef<any>();

  const scrollToBottom = () => {
      bottomRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  scrollToBottom();

  return (
    <div>
      {messages?.map((m, i) => (
        <ChatLine key={m.shortcode} message={m} />
      ))}
      <div ref={bottomRef} className="list-bottom"></div>
    </div>
  );

};
export default ChatMessages;



// import React from "react";
// import ScrollToBottom from "react-scroll-to-bottom";
// import ChatMessagesInner from "./ChatMessagesInner";
// import { ChatMessage } from "elixir-backend";
// import cx from "classnames";

// interface Props {
//   messages: Array<ChatMessage>;
//   className?: string;
// }

// export const ChatMessages: React.FC<Props> = ({ messages, className }) => {
//   return (
//     // <ScrollToBottom
//     //   className={cx(
//     //     "bg-gray-700 rounded p-2 overflow-hidden",
//     //     className
//     //   )}
//     // >
//       <ChatMessagesInner messages={messages} />
//     // </ScrollToBottom>
//   );
// };
// export default ChatMessages;
