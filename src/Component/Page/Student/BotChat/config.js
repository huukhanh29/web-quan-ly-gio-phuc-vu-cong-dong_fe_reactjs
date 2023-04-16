import { Avatar } from 'flowbite-react';
import { createChatBotMessage } from 'react-chatbot-kit';
import logoBot from "./bot.jpg"
import { useStore } from 'react-redux';
const AvatarChat = ()=>{
  const { avatar} = useStore().getState().auth;
  return avatar;
};
const basUrl = "http://localhost:8070/";
const botName="Trợ lý cố vấn học tập"
const config = {
  botName: botName, //Tên chatbot
  initialMessages: [
    createChatBotMessage('Xin chào! Bạn cần hỗ trợ vấn đề gì!')
  ], //Tin nhắn chào

  customStyles: {
    botMessageBox: { //màu tin nhắn
      backgroundColor: '#0000FF', //xạnh
    },
    chatButton: { //màu nút chát
      backgroundColor: 'blue', //đỏ
    }
  },
  customComponents: {
    // Replaces the default header
    header: () => <div className='text-white font-bold pl-3 py-2 bg-blue-700'>{botName}</div>,
   // Replaces the default bot avatar
    botAvatar: () => <Avatar img={logoBot} className="react-chatbot-kit-chat-bot-avatar-container"/>,
  //  // Replaces the default bot chat message container
  //  botChatMessage: (props) => <MyCustomChatMessage {...props} />,
  //  // Replaces the default user icon
    userAvatar: () => <Avatar img={basUrl + "files/" + AvatarChat()} className="react-chatbot-kit-user-avatar-container" />,
  //  // Replaces the default user chat message
  //  userChatMessage: (props) => <MyCustomUserChatMessage {...props} />
 },

};

export default config;