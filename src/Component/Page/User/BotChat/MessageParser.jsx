// import axios from "axios";

import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../store/authSlice";

const MessageParser = ({ children, actions }) => {
  const dispatch = useDispatch();
  const ParseFunc = async (message) => {
    //message là nội dung được nhập vào
    if (message.includes("Thông tin của tôi")) {
      //Logic mình sẽ tự định nghĩa nhe!
      actions.handleProfile(); //Thực hiện hành động handelHello đã đăng kí bên ActionProvider
      return;
    }
    if (message.includes("hello")) {
      //Logic mình sẽ tự định nghĩa nhe!
      actions.handleHello(); //Thực hiện hành động handelHello đã đăng kí bên ActionProvider
      return;
    }
    try {
      const { data, status } = await axios.post("faq/question", {
        question: message,
      });
      if (status === 200 && data === "unknown") {
        actions.handelUnknowMessage();
      } else {
        actions.handleMessage(`Bạn muốn hỏi về ${data.question}?`);
        actions.handleMessage(data.answer);
      }
    } catch (error) {
      if (error.response.status === 403) dispatch(setToken(""));
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: ParseFunc, //Chỉ định hàm để xử lí nội dung nhập vào
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;
