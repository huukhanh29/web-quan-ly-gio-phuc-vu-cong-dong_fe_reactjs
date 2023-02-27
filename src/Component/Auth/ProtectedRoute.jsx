import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { setAuthorized } from "../../store/authSlice";
//
function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const {authorized, token} = useSelector((state) => (state.auth));
  axios.defaults.baseURL = "http://localhost:8070/";
  axios.defaults.headers.common["Authorization"] = `Bearer ${token ?? ""}`;
  if (token!=="") {
    dispatch(setAuthorized(true));
  }
  //console.log(authorized)
  return authorized ? (
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

