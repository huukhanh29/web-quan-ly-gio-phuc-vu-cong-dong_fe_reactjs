import { useDispatch, useSelector, useStore } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { setAuthorized } from "../../store/authSlice";
import { useEffect } from "react";
//
function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const {authorized} = useSelector((state) => (state.auth));
  const token = useStore().getState().auth.token;
  axios.defaults.baseURL = "http://localhost:8070/";
  axios.defaults.headers.common["Authorization"] = `Bearer ${token ?? ""}`;
  useEffect(() => {
    if (token && !authorized) {
      dispatch(setAuthorized(true));
    }
  }, [dispatch, token,authorized]);
  //console.log(authorized)
  return authorized || token ? (
    children ? (
      children
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/login" replace />
  );
}

export default ProtectedRoute;
 