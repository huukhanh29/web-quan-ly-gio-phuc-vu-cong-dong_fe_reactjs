import { Avatar, Dropdown, Navbar, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";
import logoCtu from "./ctu.ico";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { setToken } from "../../store/authSlice";
export default function Header() {
  const {token} = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const id = decoded.id;
  const dispatch = useDispatch();
  const avatar = useSelector((state) => state.auth.avatar);
  const [users, setUsers] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      const { data, status } = await axios.get(`/user/get/${id}`);
      if (status === 200) {
        setUsers(data);
      }
    } catch (error) {
      if (error.response === 403) {
        console.log(error.response)
        dispatch(setToken(""));
      }
    }
  }, [ id, dispatch]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const basUrl = "http://localhost:8070/";
  
  return users === null ? (
    <Spinner color="failure" />
  ) : (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand as={Link} to={"/"}>
        <img src={logoCtu} className="mr-3 ml-2 h-6 sm:h-9" alt="CTU Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CTU
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 ">
      <span className="mr-2 mt-2 font-semibold text-md">{users.name}</span>
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              alt="User settings"
              img={basUrl + "files/" + (avatar || users.avatar)}
              rounded={true}
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Hello {users.username}</span>
            <span className="block truncate text-sm font-medium">{users.email}</span>
          </Dropdown.Header>
          <Dropdown.Item>
            <Link className="w-full" to={`/profile`}>
              Profile
            </Link>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <Logout />
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/navbars" active={true}>
          Home
        </Navbar.Link>
        <Navbar.Link href="/navbars">About</Navbar.Link>
        <Navbar.Link href="/navbars">Services</Navbar.Link>
        <Navbar.Link href="/navbars">Pricing</Navbar.Link>
        <Navbar.Link href="/navbars">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
