import { useStore } from "react-redux";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
//
function ProtectedAuthRoute({ children, role }) {
  const store = useStore();
  const token = store.getState().auth.token;
  const decoded = jwt_decode(token);
  const roleCheck = decoded.role[0].authority;
  if (roleCheck !== role) {
    return <Navigate to="/403" />;
  }
  return children;
}


export default ProtectedAuthRoute;
