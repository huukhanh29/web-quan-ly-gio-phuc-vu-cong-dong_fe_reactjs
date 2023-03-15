import axios from "axios";
import jwtDecode from "jwt-decode";
import { useDispatch, useStore } from "react-redux";
import { logOut, setAuthorized } from "../../../store/authSlice";
import { ChartPie } from "./ChartPie";

export default function Lecturer() {
  const store = useStore();
  let id = "0";
  const token = store.getState().auth.token;
  if (token) {
    id = jwtDecode(token).id;
  }
  //const id = jwtDecode(token).id;
  const dispatch = useDispatch();
  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(`/user/get/${id}`);
        console.log(response);
      } catch (error) {
        if (error.response.status === 403) {
          dispatch(logOut());
          dispatch(setAuthorized(false));
        }
      }
    }
  };
  fetchData();
  return (
    <ChartPie/>
  );
}
