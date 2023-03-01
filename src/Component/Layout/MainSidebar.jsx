import { faStackExchange } from "@fortawesome/free-brands-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
  faComment,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Sidebar } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useState } from "react";

export default function MainSidebar() {
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const { pathname } = useLocation();
  const { token } = useSelector((state) => state.auth);
  const decoded = jwt_decode(token);
  const role = decoded.role[0].authority;
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };
  return (
    <>
      <div className="w-fit">
        <Button gradientDuoTone="greenToBlue" onClick={toggleSidebar} className="ml-3">
        {isSidebarHidden ? (
            <FontAwesomeIcon icon={faChevronRight} />
          ) : (
            <FontAwesomeIcon icon={faChevronLeft} />
          )}
        </Button>
        <Sidebar
          aria-label="Sidebar with logo branding example"
          className={isSidebarHidden ? "hidden" : ""}
        >
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              {role === "STUDENT" && (
                <>
                  <Sidebar.Item
                    key={"student"}
                    as={Link}
                    to={"/student"}
                    className={"/student" === pathname ? activeClassname : ""}
                    icon={() => <FontAwesomeIcon icon={faUser} />}
                  >
                    Thông tin sinh viên
                  </Sidebar.Item>
                  <Sidebar.Item
                    key={"feeback"}
                    as={Link}
                    to={"/student/send-feedback"}
                    className={
                      "/student/send-feedback" === pathname
                        ? activeClassname
                        : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faComment} />}
                  >
                    Gửi phản hồi
                  </Sidebar.Item>
                  <Sidebar.Item
                    key={"feebackTable"}
                    as={Link}
                    to={"/student/list-feedback"}
                    className={
                      "/student/list-feedback" === pathname
                        ? activeClassname
                        : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faStackExchange} />}
                  >
                    Danh sách phản hồi
                  </Sidebar.Item>
                </>
              )}
              {role === "ADMIN" && (
                <>
                <Sidebar.Item
                  key={"chatbot"}
                  as={Link}
                  to={"/admin/list-faq"}
                  className={
                    "/admin/list-faq" === pathname ? activeClassname : ""
                  }
                  icon={() => <FontAwesomeIcon icon={faComment} />}
                >
                  Quản lý Chat
                </Sidebar.Item>
                <Sidebar.Item
                  key={"user"}
                  as={Link}
                  to={"/admin/list-user"}
                  className={
                    "/admin/list-user" === pathname ? activeClassname : ""
                  }
                  icon={() => <FontAwesomeIcon icon={faComment} />}
                >
                  Quản lý User
                </Sidebar.Item>
                </>
                
                
              )}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
}
