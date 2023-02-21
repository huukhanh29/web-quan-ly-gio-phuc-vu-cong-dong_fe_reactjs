import { useState } from "react";
import "./BotChat/BotChat.css";
import Chatbot from "react-chatbot-kit";
import { ConditionallyRender } from "react-util-kit";
import ActionProvider from "./BotChat/ActionProvider";
import config from "./BotChat/config";
import MessageParser from "./BotChat/MessageParser";
import "react-chatbot-kit/build/main.css";
import { ReactComponent as ButtonIcon } from "./BotChat/robot.svg";
import { Avatar } from "flowbite-react";
export default function User() {
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
        onClick={() => toggleChatbot((prev) => !prev)}
      >
        <ButtonIcon className="app-chatbot-button-icon" />
      </button>
    </div>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar
                  alt="Default avatar with alt text"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded={true}
                  size="xl"
                />
              </div>
            </div>
            
          </div>
          <div className="mt-6">
            <div className="max-w-3xl mx-auto bg-white overflow-hidden shadow-md rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  dd
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">s</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Contact Information
                </h2>
                <dl className="mt-1 max-w-2xl text-sm text-gray-500 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="font-medium text-gray-500">Email</dt>
                    <dd className="mt-1">@gamil.com</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1">23234234</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-gray-500">Address</dt>
                    <dd className="mt-1">Ct</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
