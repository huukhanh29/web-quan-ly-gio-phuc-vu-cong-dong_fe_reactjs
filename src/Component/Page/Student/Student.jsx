import { useState } from "react";
import "./BotChat/BotChat.css";
import Chatbot from "react-chatbot-kit";
import { ConditionallyRender } from "react-util-kit";
import ActionProvider from "./BotChat/ActionProvider";
import config from "./BotChat/config";
import MessageParser from "./BotChat/MessageParser";
import "react-chatbot-kit/build/main.css";
import { ReactComponent as ButtonIcon } from "./BotChat/robot.svg";
import Profile from "../Profile/Profile";
export default function Student() {
  const [showChatbot, toggleChatbot] = useState(false);
  return (
    <div>
      <div className="app-chatbot-container" style={{ zIndex: "999" }}>
        <ConditionallyRender
          ifTrue={showChatbot}
          show={
            <Chatbot
              config={config}
              placeholderText="Nhập tin nhắn..."
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          }
        />
        <button
          className="app-chatbot-button"
          onClick={() => { toggleChatbot((prev) => !prev); }}
        >
          <ButtonIcon className="app-chatbot-button-icon" />
        </button>
      </div>
      <Profile/>
    </div>
  );
}
