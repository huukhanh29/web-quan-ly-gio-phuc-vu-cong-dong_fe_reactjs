import React from "react";
import { useSelector } from "react-redux";
import MessageView from "./MessageView";
import axios from "axios";
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const { username } = useSelector((state) => ({
    username: state.auth.username,
    token: state.auth.token,
  }));
  //Định nghĩa hàm để thực hiện 1 hành động nào đó
  const handleHello = () => {
    const botMessage = createChatBotMessage("Hello!");

    setState((prev) => ({
      ...prev,

      messages: [...prev.messages, botMessage], //setState để render tin nhắn ra màn hình
    }));
  };
  const handleProfile = async () => {
    const response = await axios.get(`user/get/${username}`);
    const { data } = response;
    const botMessage = createChatBotMessage(data.username);
    setState((prev) => ({
      ...prev,

      messages: [...prev.messages, botMessage],
    }));
  };
  const handleMessage = (message) => {
    const botMessage = createChatBotMessage(<MessageView message={message} />);
    setState((prev) => ({
      ...prev,

      messages: [...prev.messages, botMessage],
    }));
  };

  const handelUnknowMessage = () => {
    const botMessage = createChatBotMessage(
      "Xin lỗi! Câu hỏi của bạn vẫn chưa có câu trả lời!"
    );
    setState((prev) => ({
      ...prev,

      messages: [...prev.messages, botMessage], //setState để render tin nhắn ra màn hình
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            //Đăng kí các hành động cần thiết
            handleHello,
            handleMessage,
            handleProfile,
            handelUnknowMessage,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
