import { useStore } from "react-redux";
import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";
export default function Home() {
  const store = useStore();
  const token = store.getState().auth.token;
  const decoded = jwt_decode(token);
  const role = decoded.role[0].authority;
  if(!role){
    return(<Navigate to = "login"/>)
  }
  return (
    <>
      {role === "ADMIN" && (
        <Navigate to="/admin" />
      ) } 
      {role === "STUDENT" && (
        <Navigate to="/student" />
      ) } 
      {role === "LECTURER" && (
        <Navigate to="/lecturer" />
      ) } 
    </>
  );
}
