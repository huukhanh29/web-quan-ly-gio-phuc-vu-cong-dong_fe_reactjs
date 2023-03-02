import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";
import logoCtu from "./ctu.ico";
import React from "react";
import { useStore } from "react-redux";
import jwt_decode from "jwt-decode";
export default function Header() {
  const store = useStore();
  const token = store.getState().auth.token;
  const decoded = jwt_decode(token);
  const name = decoded.name;
  const email = decoded.email;
  const avatar = decoded.avatar;
  const username = decoded.username;
  const basUrl = "http://localhost:8070/";
  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand as={Link} to={"/"}>
        <img src={logoCtu} className="mr-3 ml-2 h-6 sm:h-9" alt="CTU Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CTU
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 ">
      <span className="mr-2 mt-2 font-semibold text-md">{name}</span>
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              alt="User settings"
              img={basUrl + "image/" + avatar}
              rounded={true}
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Hello {username}</span>
            <span className="block truncate text-sm font-medium">{email}</span>
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
