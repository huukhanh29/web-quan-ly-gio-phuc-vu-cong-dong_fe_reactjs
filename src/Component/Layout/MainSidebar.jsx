import { faStackExchange } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendar,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faComment,
  faComments,
  faPieChart,
  faReply,
  faTasks,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
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
        <Button
          gradientDuoTone="greenToBlue"
          onClick={toggleSidebar}
          className="ml-3"
        >
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
                  <Sidebar.Item
                    key={"history"}
                    as={Link}
                    to={"/student/list-history"}
                    className={
                      "/student/list-history" === pathname
                        ? activeClassname
                        : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faReply} />}
                  >
                    Lịch sử
                  </Sidebar.Item>
                </>
              )}
              {role === "ADMIN" && (
                <>
                  <Sidebar.Item
                    key={"user"}
                    as={Link}
                    to={"/admin/list-user"}
                    className={
                      "/admin/list-user" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faUsers} />}
                  >
                    Quản lý User
                  </Sidebar.Item>
                  
                  <Sidebar.Item
                    key={"chatbot"}
                    as={Link}
                    to={"/admin/list-faq"}
                    className={
                      "/admin/list-faq" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faComments} />}
                  >
                    Quản lý Chat
                  </Sidebar.Item>
                  <Sidebar.Item
                    key={"feedback_admin"}
                    as={Link}
                    to={"/admin/list-feedback"}
                    className={
                      "/admin/list-feedback" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faStackExchange} />}
                  >
                    Quản lý phản hồi
                  </Sidebar.Item>
                  <Sidebar.Item
                    key={"activity"}
                    as={Link}
                    to={"/admin/list-activity"}
                    className={
                      "/admin/list-activity" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faTasks} />}
                  >
                    Hoạt động
                  </Sidebar.Item>
                  <Sidebar.Item
                    key={"approve"}
                    as={Link}
                    to={"/admin/manager-activity"}
                    className={
                      "/admin/manager-activity" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faCheck} />}
                  >
                    Phê duyệt/Xác nhận
                  </Sidebar.Item>
                  <Sidebar.Item
                    key={"calendar"}
                    as={Link}
                    to={"/admin/calendar"}
                    className={
                      "/admin/calendar" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faCalendar} />}
                  >
                    Lịch
                  </Sidebar.Item>
                  
                </>
              )}
              {role === "LECTURER" && (
                <>
                <Sidebar.Item
                    key={"chartpie"}
                    as={Link}
                    to={"/lecturer/chartpie-activity"}
                    className={
                      "/lecturer/chartpie-activity" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faPieChart} />}
                  >
                    Biểu đồ hoạt động
                  </Sidebar.Item>
                  <Sidebar.Item
                    key={"activitylecturer"}
                    as={Link}
                    to={"/lecturer/list-activity"}
                    className={
                      "/lecturer/list-activity" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faTasks} />}
                  >
                    Quản lý hoạt động
                  </Sidebar.Item>
                  <Sidebar.Item
                    key={"calendarl"}
                    as={Link}
                    to={"/lecturer/calendar"}
                    className={
                      "/lecturer/calendar" === pathname ? activeClassname : ""
                    }
                    icon={() => <FontAwesomeIcon icon={faCalendar} />}
                  >
                    Lịch
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
