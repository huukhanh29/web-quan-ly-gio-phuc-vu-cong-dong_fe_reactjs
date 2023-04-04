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
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons";

export default function ListLecturer() {
  const basUrl = "http://localhost:8070/";
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const role = "LECTURER";
  const [jobs, setJobs] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/user/get/all?page=${currentPage}&size=${pageSize}&sortBy=${sort.sortBy}&sortDir=${sort.sortDir}&searchTerm=${searchTerm}&role=${role}`
      );
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [currentPage, dispatch, pageSize, sort, searchTerm]);
  const getJob = useCallback(async () => {
    try {
      const { data } = await axios.get(`/user/job/get/all`);
      setJobs(data);
      console.log(data);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch]);
  useEffect(() => {
    document.title = "Danh sách người dùng";
    fetchData();
    getJob();
  }, [fetchData, getJob]);
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
  //đổi chức danh
  const handleJobChange = (id, jobId) => {
    axios
      .put(`/user/job/update/${id}/${jobId}`)
      .then((res) => {
        fetchData();
        //console.log(res)
        if (res.data.message === "WARNING") {
          toast.warning("Không thay đổi");
        } else {
          toast.success("Cập nhật chức danh thành công");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //xem ds hoạt động
  const showListActivity = (id) => {
    axios
      .get(`/activities/manager/users/${id}/activities`)
      .then((response) => {
        Swal.fire({
          title: "Danh sách hoạt động",
          html: `
              <div class="table-wrapper">
                <table class="swal2-table">
                  <thead>
                    <tr>
                      <th scope="col">Tên</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${response.data
                      .map((row) => {
                        return `
                          <tr>
                            <td class="activity-name" id="activity-${row.id}">${row.name}</td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            `,
          confirmButtonText: "OK",
          focusConfirm: false,
          allowOutsideClick: () => !Swal.isLoading(),
          didOpen: () => {
            const activityNameElements =
              document.querySelectorAll(".activity-name");
            activityNameElements.forEach((element) => {
              element.addEventListener("click", () => {
                const activityId = element.getAttribute("id").split("-")[1];
                showFormInfo(activityId, id);
              });
            });
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //xem chi tiết hoạt động
  const showFormInfo = (activityId, id) => {
    axios
      .get(`/activities/get/${activityId}`)
      .then((response) => {
        const item = response.data;
        Swal.fire({
          title: "Thông tin",
          html: `
        <table class="swal2-table">
          <tr>
            <td>Tên</td>
            <td>${item.name}</td>
          </tr>
          <tr>
            <td>Mô tả</td>
            <td>${item.description}</td>
          </tr>
          <tr>
            <td>Địa điểm</td>
            <td>${item.location}</td>
          </tr>
          <tr>
            <td>Bắt đầu</td>
            <td> ${
              new Date(item.startTime).toLocaleTimeString("en-GB") +
                " " +
                new Date(item.startTime).toLocaleDateString("en-GB") ?? ""
            }</td>
          </tr>
          <tr>
            <td>Kết thúc</td>
            <td> ${
              new Date(item.endTime).toLocaleTimeString("en-GB") +
                " " +
                new Date(item.endTime).toLocaleDateString("en-GB") ?? ""
            }</td>
          </tr>
          <tr>
            <td>Loại hoạt động</td>
            <td>${item.activityType.name}</td>
          </tr>
          <tr>
            <td>Giờ tích lũy</td>
            <td>${item.accumulatedTime}</td>
          </tr>
          <tr>
            <td>Trạng thái</td>
            <td>${item.status}</td>
          </tr>
        </table>
      `,
          cancelButtonText: "Quay lại",
          confirmButtonText: "OK",
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          allowOutsideClick: () => !Swal.isLoading(),
          didOpen: () => {
            Swal.getCancelButton().addEventListener("click", () => {
              showListActivity(id);
            });
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return users === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Danh sách giảng viên</Label>
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
            onClick={() => handleSortChange("id", "ASC")}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap gap-2 ml-9">
          <Badge color="white">Chế độ sắp xếp:</Badge>
          <Badge onClick={() => handleRefresh()} color="failure">
            Làm mới
          </Badge>
          <Badge onClick={() => handleSortChange("id", "ASC")} color="info">
            Mã số
          </Badge>
          <Badge
            onClick={() => handleSortChange("createdAt", "DESC")}
            color="warning"
          >
            Ngày tạo
          </Badge>
          <Badge
            onClick={() => handleSortChange("updatedAt", "DESC")}
            color="purple"
          >
            Ngày cập nhật
          </Badge>
          <Badge color="white">Số hàng:</Badge>
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
          <Table.HeadCell onClick={() => handleSortChange("name", "ASC")}>
            Tên
          </Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("username", "ASC")}>
            Username
          </Table.HeadCell>
          <Table.HeadCell>Chức danh</Table.HeadCell>
          <Table.HeadCell>Hoạt động</Table.HeadCell>
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
                  src={basUrl + "files/" + item.avatar}
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
                <Dropdown
                  label={item.jobTitle?.name}
                  style={{ width: "190px" }}
                  color="white"
                >
                  {jobs.map((job, index) => (
                    <Dropdown.Item
                      onClick={() => handleJobChange(item.id, job.id)}
                      key={index + 1}
                    >
                      {job.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </Table.Cell>
              <Table.Cell className="whitespace-normal text-gray-900 dark:text-white">
                <div className="flex justify-end">
                  <Button
                    style={{ height: "30px", width: "30px" }}
                    onClick={() => showListActivity(item.id)}
                    className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faTasks} />
                  </Button>
                </div>
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
