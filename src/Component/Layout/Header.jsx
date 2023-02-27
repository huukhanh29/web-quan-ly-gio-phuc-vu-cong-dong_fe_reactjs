import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";
import logoGuest from "./User.png";
import logoCtu from "./ctu.ico";
import React from "react";

export default function Header() {
  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand as={Link} to={"/"}>
        <img src={logoCtu} className="mr-3 ml-2 h-6 sm:h-9" alt="CTU Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CTU
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={<Avatar alt="User settings" img={logoGuest} rounded={true} />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Hello Guest</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>
            <Link className="w-full" to={"/login"}>
              Login
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
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
