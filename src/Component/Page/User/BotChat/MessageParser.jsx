// import axios from "axios";

import axios from "axios";
import React from "react";

const MessageParser = ({ children, actions }) => {
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
    const response = await axios.post("faq/question",{
      question: message
    });
    const {data, status}=response
    //console.log(response)
    if(status===200 && data === 404){
      actions.handelUnknowMessage()
    }else{
      actions.handleMessage(`Bạn muốn hỏi về ${data.question}?`); 
      actions.handleMessage(data.answer); 
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