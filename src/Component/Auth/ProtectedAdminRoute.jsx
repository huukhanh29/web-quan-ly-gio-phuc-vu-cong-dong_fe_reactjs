import { useStore } from "react-redux";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
function ProtectedRoute({ children, role }) {
  const store = useStore();
  const token = store.getState().auth.token;
  const [userRole, setUserRole] = useState(role);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      const id = decoded.id;
      axios.get(`/user/get/${id}`).then((response) => {
        const user = response.data;
        setUserRole(user.role);
        setIsLoading(false);
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace={true}/>;
  }

  if (isLoading) {
    return <Spinner
    color="failure"
    aria-label="Failure spinner example"
  />;
  }

  const decoded = jwt_decode(token);
  if (userRole !== decoded.role[0].authority) {
    return <div>403</div>;
  }
  return children;
}

export default ProtectedRoute;

