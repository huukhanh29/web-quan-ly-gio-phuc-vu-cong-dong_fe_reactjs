import { faStackExchange } from "@fortawesome/free-brands-svg-icons";
import { faComment, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

export default function MainSidebar() {
    const {pathname} = useLocation();
const activeClassname= 'bg-gradient-to-r from-green-300 to-blue-400'
  return (
    <div className="w-fit">
      <Sidebar aria-label="Sidebar with logo branding example">
        {/* <Sidebar.Logo href="#" img="favicon.png" imgAlt="Flowbite logo">
          Flowbite
        </Sidebar.Logo> */}
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            
            <Sidebar.Item
              key={"User"}
              as={Link}
              to={"/user"}
              className={
                '/user'=== pathname ? activeClassname: ''
              }
              icon={() => <FontAwesomeIcon icon={faUser} />}
            >
              Profile
            </Sidebar.Item>
            <Sidebar.Item
              key={"feeback"}
              as={Link}
              to={"/user/send-feedback"}
              className={
                '/user/send-feedback'=== pathname ? activeClassname: ''
              }
              icon={() => <FontAwesomeIcon icon={faComment} />}
            >
              Feedback Send
            </Sidebar.Item>
            <Sidebar.Item
              key={"feebackTable"}
              as={Link}
              to={"/user/list-feedback"}
              className={
                '/user/list-feedback'=== pathname ? activeClassname: ''
              }
              icon={() => <FontAwesomeIcon icon={faStackExchange} />}
            >
              Feedback List
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
