import { faStackExchange } from "@fortawesome/free-brands-svg-icons";
import { faComment, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sidebar } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function MainSidebar() {
  const { pathname } = useLocation();
  const {token} = useSelector((state) => (state.auth))
  const decoded = jwt_decode(token);
  const role = decoded.role[0].authority;
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  return (
    <div className="w-fit">
      <Sidebar aria-label="Sidebar with logo branding example">
        {/* <Sidebar.Logo href="#" img="favicon.png" imgAlt="Flowbite logo">
          Flowbite
        </Sidebar.Logo> */}
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
                Profile
              </Sidebar.Item>
              <Sidebar.Item
                key={"feeback"}
                as={Link}
                to={"/student/send-feedback"}
                className={
                  "/student/send-feedback" === pathname ? activeClassname : ""
                }
                icon={() => <FontAwesomeIcon icon={faComment} />}
              >
                Feedback Send
              </Sidebar.Item>
              <Sidebar.Item
                key={"feebackTable"}
                as={Link}
                to={"/student/list-feedback"}
                className={
                  "/student/list-feedback" === pathname ? activeClassname : ""
                }
                icon={() => <FontAwesomeIcon icon={faStackExchange} />}
              >
                Feedback List
              </Sidebar.Item>
              </>
          )}
              {role === "ADMIN" && (
          
            <Sidebar.Item
                key={"chatbot"}
                as={Link}
                to={"/admin/list-chatbot"}
                className={
                  "/admin/list-chatbot" === pathname ? activeClassname : ""
                }
                icon={() => <FontAwesomeIcon icon={faComment} />}
              >
                Feedback List
              </Sidebar.Item>
              )}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
