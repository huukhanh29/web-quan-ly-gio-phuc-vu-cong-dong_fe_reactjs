import axios from "axios";
import { Card } from "flowbite-react";
import jwtDecode from "jwt-decode";
import { useDispatch, useStore } from "react-redux";
import { setToken } from "../../../store/authSlice";



export default function Admin() {
  const store = useStore();
  let id = "0";
  const token = store.getState().auth.token;
  if(token){
    id = jwtDecode(token).id
  }
  //const id = jwtDecode(token).id;
  const dispatch = useDispatch();
    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get(`/user/get/${id}`);
        } catch (error) {
          if (error.response.status === 403) {
            //dispatch(logOut())
            dispatch(setToken(""));
          }
        }
      }
    };
    fetchData()
  return (
    <Card>
      heloo
    </Card>
  );
}
