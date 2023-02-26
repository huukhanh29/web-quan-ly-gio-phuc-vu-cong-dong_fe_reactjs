import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut, setAuthorized } from "../../store/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    //dispatch(setAuthorized(false));
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <p className="dropdown-item" onClick={handleLogout}>
      Logout
    </p>
  );
};

export default Logout;
