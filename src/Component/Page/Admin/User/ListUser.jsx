import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Label,
  Pagination,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../store/authSlice";
import Swal from "sweetalert2";
// import "./Sweet.css";
import { toast } from "react-toastify";

export default function ListUser() {
  const basUrl = "http://localhost:8070/";
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/user/get/all?page=${currentPage}&size=${pageSize}&sortBy=${sort.sortBy}&sortDir=${sort.sortDir}&searchTerm=${searchTerm}`
      );

      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [currentPage, dispatch, pageSize, sort, searchTerm]);

  useEffect(() => {
    document.title = "Danh sách người dùng";
    fetchData();
  }, [fetchData]);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
    fetchData();
  };

  const handleSortChange = (sortBy, sortDir) => {
    setSort({ sortBy: sortBy, sortDir: sortDir });
    setCurrentPage(0);
    fetchData();
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    fetchData();
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSort({ sortBy: "id", sortDir: "ASC" });
    setPageSize(10);
    setCurrentPage(0);
  };
  const showFormCreate = () => {
    Swal.fire({
      title: "Thêm người dùng",
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Name" style="height:30px">
        <input type="text" id="username" class="swal2-input" placeholder="Username" style="height:30px">
        <input type="email" id="email" class="swal2-input" placeholder="Email" style="height:30px">
        <input type="password" id="password" class="swal2-input" placeholder="Password" style="height:30px">
        <input type="password" id="cpassword" class="swal2-input" placeholder="Confirm Password" style="height:30px">
        <select id="role" class="swal2-input" style="height:30px">
          <option value="ADMIN">ADMIN</option>
          <option value="LECTURER">LECTURER</option>
          <option value="STUDENT">STUDENT</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#name").value;
        const username = Swal.getPopup().querySelector("#username").value;
        const email = Swal.getPopup().querySelector("#email").value;
        const password = Swal.getPopup().querySelector("#password").value;
        const cpassword = Swal.getPopup().querySelector("#cpassword").value;
        const role = Swal.getPopup().querySelector("#role").value;

        // Check if email is valid
        if (!/\S+@\S+\.\S+/.test(email)) {
          Swal.showValidationMessage("Email không hợp lệ");
          return false; // prevent closing the modal
        }

        // Check if passwords match
        if (password !== cpassword) {
          Swal.showValidationMessage("Mật khẩu không khớp");
          return false; // prevent closing the modal
        }

        // Check if required fields are not empty
        if (!name || !email || !username || !password) {
          Swal.showValidationMessage("Vui lòng nhập đủ thông tin");
          return false; // prevent closing the modal
        }

        // Submit the form if all checks pass
        const newData = { name, username, email, password, role };
        return axios
          .post("/auth/signup", newData)
          .then((response) => {
            fetchData();
            handleSortChange("createdAt", "DESC");
            toast.success("Thêm thành công");
          })
          .catch((error) => {
            if (error.response.data.message === "ERROR: EMAIL WAS USED") {
              Swal.showValidationMessage("Email đã tồn tại");
            } else if (
              error.response.data.message === "ERROR: USERNAME WAS USED"
            ) {
              Swal.showValidationMessage("Username đã tồn tại");
            } else {
              Swal.showValidationMessage("Có lỗi xảy ra khi thêm người dùng");
              //console.error(error);
            }
            return false; // prevent closing the modal
          });
      },
    });
  };
  const handleStatusChange = (username, status) => {
    const newStatus = { username, status };
    axios
      .post("/user/update/status", newStatus)
      .then((res) => {
        fetchData();
        if(res.data.message === "WARNING"){
            toast.warning("Không thay đổi trang thái")
        }else{
            toast.success("Cập nhật trạng thái thành công");
        }
        
      })
      .catch((error) => {
        if(error.response.data.message === "ERROR"){
            toast.error("Không thể thay đổi trang thái của admin")
        }
          console.error(error);
      });
  };
  return users === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Danh sách người dùng</Label>
        <div className="flex items-center">
          <TextInput
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleInputChange}
            className="py-1 mr-2"
            style={{ height: "30px", width: "350px" }}
          />
          <Button
            className={activeClassname}
            style={{ height: "30px" }}
            onClick={() => handleSortChange("id")}
          >
            Tìm kiếm
          </Button>
        </div>
        <Button
          style={{ height: "30px" }}
          onClick={() => showFormCreate()}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="ml-2">Thêm</span>
        </Button>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap gap-2 ml-9">
          <Badge onClick={() => handleRefresh()} color="gray">
            Refresh
          </Badge>
          <Badge onClick={() => handleSortChange("id", "ASC")} color="info">
            Id
          </Badge>
          <Badge
            onClick={() => handleSortChange("name", "ASC")}
            color="success"
          >
            Name
          </Badge>
          <Badge
            onClick={() => handleSortChange("username", "ASC")}
            color="failure"
          >
            Username
          </Badge>
          <Badge onClick={() => handleSortChange("email", "ASC")} color="pink">
            Email
          </Badge>
          <Badge
            onClick={() => handleSortChange("createdAt", "DESC")}
            color="warning"
          >
            Create
          </Badge>
          <Badge
            onClick={() => handleSortChange("updatedAt", "DESC")}
            color="purple"
          >
            Update
          </Badge>
          <Dropdown
            label={pageSize}
            style={{ height: "21px", width: "50px" }}
            color="greenToBlue"
          >
            <Dropdown.Item onClick={() => handlePageSizeChange(5)}>
              5
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handlePageSizeChange(10)}>
              10
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handlePageSizeChange(15)}>
              15
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handlePageSizeChange(20)}>
              20
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      <Table hoverable={true}>
        <Table.Head className={activeClassname}>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>Ảnh đại diện</Table.HeadCell>
          <Table.HeadCell>Tên</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Quyền</Table.HeadCell>
          <Table.HeadCell>Trạng thái</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map((item, index) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={item.id}
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                <img
                  src={basUrl + "image/" + item.avatar}
                  alt="aaa"
                  width="50px"
                  height="50px"
                />
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                {item.name}
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                {item.username}
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                {item.email}
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                {item.role}
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white text-center">
                {item.status === 1 && (
                  <Dropdown
                    label="active"
                    style={{ height: "21px", width: "80px" }}
                    gradientDuoTone="tealToLime"
                  >
                    <Dropdown.Item onClick={() => handleStatusChange(item.username,"active")}>
                      <Badge color="success" className="flex justify-center">
                        active
                      </Badge>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleStatusChange(item.username,"disable")}
                    >
                      <Badge color="failure" className="flex justify-center">
                        disable
                      </Badge>
                    </Dropdown.Item>
                  </Dropdown>
                )}
                {item.status === 0 && (
                  <Dropdown
                    label="disable"
                    style={{ height: "21px", width: "80px" }}
                    gradientDuoTone="pinkToOrange"
                  >
                    <Dropdown.Item onClick={() => handleStatusChange(item.username,"active")}>
                      <Badge color="success" className="flex justify-center">
                        active
                      </Badge>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleStatusChange(item.username,"disable")}
                    >
                      <Badge color="failure" className="flex justify-center">
                        disable
                      </Badge>
                    </Dropdown.Item>
                  </Dropdown>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        className="flex justify-center "
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Card>
  );
}
