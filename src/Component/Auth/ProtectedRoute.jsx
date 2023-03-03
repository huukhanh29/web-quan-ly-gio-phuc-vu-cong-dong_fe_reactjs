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
  }, [dispatch, token]);
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
  // const store = useStore();
  // const token = store.getState().auth.token;
  // const [userRole, setUserRole] = useState(role);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (token) {
  //     const decoded = jwt_decode(token);
  //     const id = decoded.id;
  //     axios.get(`/user/get/${id}`).then((response) => {
  //       const user = response.data;
  //       setUserRole(user.role);
  //       setIsLoading(false);
  //     });
  //   }
  // }, [token]);

  // if (!token) {
  //   return <Navigate to="/login" replace={true}/>;
  // }

  // if (isLoading) {
  //   return <Spinner
  //   color="failure"
  //   aria-label="Failure spinner example"
  // />;
  // }

  // const decoded = jwt_decode(token);
  // if (userRole !== decoded.role[0].authority) {
  //   return <div>403</div>;
  // }
  // return children;

