import { Avatar, Dropdown, Navbar, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";
import logoCtu from "./ctu.ico";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { setToken } from "../../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faMessage,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function Header() {
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const { id } = decoded;
  const role = decoded.role[0].authority
  const dispatch = useDispatch();
  const { avatar, message } = useSelector((state) => state.auth);
  const [users, setUsers] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      const { data, status } = await axios.get(`/user/get/${id}`);
      if (status === 200) {
        setUsers(data);
      }
    } catch (error) {
      if (error.response === 403) {
        console.log(error.response);
        dispatch(setToken(""));
      }
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const basUrl = "http://localhost:8070/";
  //chỉnh sửa
  const handleChangePassword = () => {
    Swal.fire({
      title: "Đổi mật khẩu",
      html: `
        <input type="password" id="oldPassword" class="swal2-input" placeholder="Mật khẩu cũ" required/>
        <input type="password" id="newPassword" class="swal2-input" placeholder="Mật khẩu mới" required/>
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="Xác nhận mật khẩu mới" required/>
      `,
      confirmButtonText: "Đổi mật khẩu",
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        const oldPasswordInput = Swal.getPopup().querySelector("#oldPassword");
        const newPasswordInput = Swal.getPopup().querySelector("#newPassword");
        const confirmPasswordInput =
          Swal.getPopup().querySelector("#confirmPassword");
        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Kiểm tra mật khẩu mới
        if (newPassword.length < 6) {
          newPasswordInput.classList.add("swal2-inputerror");
          Swal.showValidationMessage(`Mật khẩu mới phải có ít nhất 6 ký tự`);
          return false;
        }
        // Kiểm tra xác nhận mật khẩu mới
        if (newPassword !== confirmPassword) {
          confirmPasswordInput.classList.add("swal2-inputerror");
          Swal.showValidationMessage(`Xác nhận mật khẩu mới không khớp`);
          return false;
        }
        const changePass = {
          oldPassword: oldPassword,
          newPassword: newPassword,
        };
        return axios
          .put(`/user/change_password/${id}`, changePass)
          .then((response) => {
            // Reload the user data after changing password
            fetchData();
            dispatch(setToken(response.data.token));
            console(response);
            toast.success("Đổi mật khẩu thành công");
          })
          .catch((error) => {
            if (error.response.data.message === "NOTMATCH") {
              //oldPasswordInput.classList.add("swal2-inputerror");
              Swal.showValidationMessage(`Mật khẩu cũ không đúng`);
              //return Promise.reject();
            }
          });
      },
    });
  };

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
              status={message !== null ? "busy" : ""}
              statusPosition="top-right"
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Hello {users.username}</span>
            <span className="block truncate text-sm font-medium">
              {users.email}
            </span>
          </Dropdown.Header>
          {(role === "STUDENT" || role === "LECTURER") && (
            <Dropdown.Item
              icon={() => <FontAwesomeIcon className="mr-2" icon={faMessage} />}
            >
              <Link className="w-full relative inline-flex items-center "
               to={`/message`}>
                  Thông báo
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-2 dark:border-gray-900">
                    {message ??"0"}
                  </div>
                
              </Link>
            </Dropdown.Item>
          )}

          <Dropdown.Item
            icon={() => <FontAwesomeIcon className="mr-2" icon={faUser} />}
          >
            <Link className="w-full" to={`/profile`}>
              Trang cá nhân
            </Link>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleChangePassword}
            icon={() => <FontAwesomeIcon className="mr-2" icon={faKey} />}
          >
            Đổi mật khẩu
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            icon={() => <FontAwesomeIcon className="mr-2" icon={faSignOut} />}
          >
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
