import { useStore } from "react-redux";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function ProtectedUserRoute({ children }) {
  const store = useStore();
  const token = store.getState().auth.token;
  const decoded = jwt_decode(token);
  const role = decoded.role[0].authority;
//   if (role !== "USER") {
//     return <Navigate to="/login" />;
//   }
//   return children;
// }
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      const id = decoded.id;
      axios.get(`/user/get/${id}`).then((response) => {
        const user = response.data;
        setUserRole(user.role);
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (userRole !== decoded.role[0].authority) {
    return <div>403</div>;
  }
  return children;
}
export default ProtectedUserRoute;
