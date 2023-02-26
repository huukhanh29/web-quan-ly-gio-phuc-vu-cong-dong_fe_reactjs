import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    role: "",
    username: "",
    token:"",
    authorized:false
  };
  export const authSlice = createSlice({
    name: "auth",  // Tên của slice, mỗi slice đặt 1 tên khác nhau để phân biệt
    initialState,// các state được lưu trong local 
    reducers: {//các hàm dùng để cập nhật giá cho các state, dùng bằng dispatch
      setLoginInfo: (state, action) => {
        state.username = action.payload.username;
        state.role = action.payload.role;
        state.token = action.payload.token;// payload là các tham số được truyền vào khi đc gọi
      },
      logOut:state=>{
        state.username = "";
        state.role = "";
        state.token= ""
      },
      setAuthorized: (state, action)=>{
        state.authorized = action.payload
      },
      setToken: (state, action) =>{
        state.token =action.payload
        if(state.token ===""){
          state.authorized = false
        }
      }
    }
  }
);
  export const { setLoginInfo, logOut, setAuthorized, setToken } = authSlice.actions;
  export default authSlice.reducer;

