import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

export default function MainSidebar() {
    const {pathname} = useLocation();

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
                '/user'=== pathname ? 'bg-cyan-200': ''
              }
              icon={() => <FontAwesomeIcon icon={faUser} />}
            >
              Profile
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
