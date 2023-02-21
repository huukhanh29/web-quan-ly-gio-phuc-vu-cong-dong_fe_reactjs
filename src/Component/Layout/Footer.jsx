import {
  faDribbble,
  faFacebook,
  faGithub,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faFax, faMapMarked, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Footer } from "flowbite-react";
import ctuLogo from "./ctu.ico";
export default function Footers() {
  return (
    <Footer container={true} className="bg-cyan-200">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="/"
              src={ctuLogo}
              alt="Flowbite Logo"
              name="ĐẠI HỌC CẦN THƠ"
            />
            <div className="mt-3 flex space-x-2 sm:mt-5 sm:justify-left">
              <Footer.Icon
                icon={() => <FontAwesomeIcon icon={faMapMarked} />}
              />
              <p>Địa chỉ: Khu 2, Đ.3/2, P.Xuân Khánh, Q.Ninh Kiều, TP.CT</p>
            </div>
            <div className="mt-3 flex space-x-2 sm:mt-0 sm:justify-left">
              <Footer.Icon
                icon={() => <FontAwesomeIcon icon={faPhone} />}
              />
              <p>Điện Thoại: +84292 3832 663</p>
            </div>
            <div className="mt-3 flex space-x-2 sm:mt-0 sm:justify-left">
              <Footer.Icon
                icon={() => <FontAwesomeIcon icon={faFax} />}
              />
              <p>Fax: +84292 3838 474</p>
            </div>
            <div className="mt-3 flex space-x-2 sm:mt-0 sm:justify-left">
              <Footer.Icon
                icon={() => <FontAwesomeIcon icon={faEnvelope} />}
              />
              <p>Mail: dhct@ctu.edu.vn</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col={true}>
                <Footer.Link href="https://www.ctu.edu.vn/">Trang chính</Footer.Link>
                <Footer.Link href="http://www.cit.ctu.edu.vn/">CIT</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col={true}>
                <Footer.Link href="https://www.facebook.com/CTUDHCT/">Facebook</Footer.Link>
                <Footer.Link href="https://www.youtube.com/ctudhct">Youtube</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright by="Flowbite™" year={2022} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon icon={() => <FontAwesomeIcon icon={faFacebook} />} />
            <Footer.Icon icon={() => <FontAwesomeIcon icon={faInstagram} />} />
            <Footer.Icon icon={() => <FontAwesomeIcon icon={faTwitter} />} />
            <Footer.Icon icon={() => <FontAwesomeIcon icon={faGithub} />} />
            <Footer.Icon icon={() => <FontAwesomeIcon icon={faDribbble} />} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
