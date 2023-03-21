import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    role: "",
    username: "",
    token:"",
    authorized:false,
    sidebar:true,
    avatar:null,
    message: null
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
        state.token= "";
        state.avatar=""
      },
      setAuthorized: (state, action)=>{
        state.authorized = action.payload
      },
      setToken: (state, action) =>{
        state.token =action.payload
        if(state.token ===""){
          state.authorized = false
        }
      },
      setSidebar:(state)=>{
        state.sidebar = !state.sidebar;
      },
      setAvatar:(state, action)=>{
        state.avatar = action.payload;
      },
      setMesage:(state, action)=>{
        state.message = action.payload;
      }
      
    }
  }
);
  export const { setLoginInfo, logOut, setAuthorized, setMesage,setCountActivity,
    setToken, setSidebar, setAvatar } = authSlice.actions;
  export default authSlice.reducer;

