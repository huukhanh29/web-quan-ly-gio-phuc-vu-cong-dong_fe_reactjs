import {
  faEdit,
  faPlus,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
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
import "./Activity.css";
import { toast } from "react-toastify";
export default function ListActivity() {
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setTypes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activityType, setActivityType] = useState("");
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/get/all`, {
        params: {
          page: currentPage,
          size: pageSize,
          sortBy: sort.sortBy,
          sortDir: sort.sortDir,
          searchTerm: searchTerm,
          status: status,
          type: activityType,
          startTime: startTime ? startTime : null,
          endTime: endTime ? endTime : null,
        },
      });
      setActivities(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [
    currentPage,
    dispatch,
    pageSize,
    sort,
    searchTerm,
    status,
    activityType,
    startTime,
    endTime,
  ]);
  const getType = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/type/get/all`);
      setTypes(data);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch]);
  useEffect(() => {
    document.title = "Danh sách hoạt động";
    getType();
    fetchData();
  }, [fetchData, getType]);
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
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };
  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };
  const handleRefresh = () => {
    setSearchTerm("");
    setSort({ sortBy: "id", sortDir: "ASC" });
    setPageSize(10);
    setCurrentPage(0);
    setStatus("");
    setStartTime("");
    setEndTime("");
    setActivityType("")
  };
  const handleStatusChange = (a) => {
    setStatus(a);
    fetchData();
  };
  const handleTypeChange = (a) => {
    setActivityType(a);
  };
  //xem chi tiết
  const showFormInfo = (id) => {
    const item = activities.find((item) => item.id === id);
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
      confirmButtonText: "OK",
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };
  //xem ds user
  const showListUser = (id) => {
    axios
      .get(`/user/get/all`, {
        params:{
          activityId: id
        }
      })
      .then((response) => {
        Swal.fire({
          title: "Danh sách giảng viên tham gia",
          html: `
            <div class="table-wrapper">
              <table class="swal2-table">
                <thead>
                  <tr>
                    <th scope="col">Tên</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                  </tr>
                </thead>
                <tbody>
                  ${response.data.content
                    .map((row) => {
                      return `
                        <tr>
                          <td>${row.name}</td>
                          <td>${row.username}</td>
                          <td>${row.email}</td>
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
        });
        
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //thêm mới
  const showFormCreate = async () => {
    await getType();
    const options = type
      .map((item) => `<option value="${item.name}">${item.name}</option>`)
      .join("");
    Swal.fire({
      title: "Thêm hoạt động",
      html: `
        <textarea type="text" id="name" class="swal2-textarea" style="height:40px;width:350px"
          placeholder="Tên hoạt động" tooltip="tooltip" title="Tên hoạt động"></textarea>
        <textarea type="text" id="description" class="swal2-textarea" style="height:40px;width:350px"
          placeholder="Mô tả" tooltip="tooltip" title="Mô tả"></textarea>
        <textarea type="text" id="location" class="swal2-textarea" style="height:40px;width:350px"
          placeholder="Địa điểm" tooltip="tooltip" title="Địa điểm"></textarea>
        <input type="datetime-local" id="startTime" class="swal2-input" tooltip="tooltip" title="Bắt đầu"
          style="height:40px;width:350px" />
        <input type="datetime-local" id="endTime" class="swal2-input" tooltip="tooltip" title="Kết thúc"
          style="height:40px;width:350px"/>
        <input type="number" id="accumulatedTime" class="swal2-input" tooltip="tooltip" title="Giờ tích lũy"
          style="height:40px;width:350px" placeholder="Giờ tích lũy"/>
        <select id="activityType" class="swal2-input" tooltip="tooltip" title="Loại hoạt động"
          style="height:40px;width:350px">
          ${options}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#name").value;
        const description = Swal.getPopup().querySelector("#description").value;
        const location = Swal.getPopup().querySelector("#location").value;
        const startTime = Swal.getPopup().querySelector("#startTime").value;
        const endTime = Swal.getPopup().querySelector("#endTime").value;
        const accumulatedTime =
          Swal.getPopup().querySelector("#accumulatedTime").value;
        const activityType =
          Swal.getPopup().querySelector("#activityType").value;
        const now = new Date();
        const s = new Date(startTime);
        const e = new Date(endTime);
        console.log(s);
        if (!name || !location || !accumulatedTime) {
          Swal.showValidationMessage("Vui lòng nhập đủ thông tin");
          return false;
        }
        if (s < now) {
          Swal.showValidationMessage(
            "Thời gian bắt đầu phải sau thời điểm hiện tại"
          );
          return false;
        }

        if (s >= e) {
          Swal.showValidationMessage(
            "Thời gian kết thúc phải sau thời gian bắt đầu"
          );
          return false;
        }
        if (e < now) {
          Swal.showValidationMessage("Thời gian kết thúc phải sau hiện tại");
          return false;
        }
        const body = {
          name: name,
          description: description,
          location: location,
          startTime: startTime,
          endTime: endTime,
          accumulatedTime: accumulatedTime,
          activityType: activityType,
        };

        return axios
          .post("/activities/create", body)
          .then((response) => {
            fetchData();
            handleSortChange("createdAt", "DESC");
            toast.success("Thêm thành công");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Có lỗi xảy ra khi thêm hoạt động");
          });
      },
    });
  };
  //chỉnh sửa
  const showFormEdit = async (id) => {
    await getType();
    const activity = activities.find((item) => item.id === id);
    const options = type
      .map(
        (item) =>
          `<option value="${item.name}" ${
            item.name === activity.activityType.name ? "selected" : ""
          }>${item.name}</option>`
      )
      .join("");
    Swal.fire({
      title: "Chỉnh sửa hoạt động",
      html: `
        <textarea type="text" id="name" class="swal2-textarea" style="height:40px;width:350px"
          placeholder="Tên hoạt động" tooltip="tooltip" title="Tên hoạt động">${
            activity.name
          }</textarea>
        <textarea type="text" id="description" class="swal2-textarea" style="height:40px;width:350px"
          placeholder="Mô tả" tooltip="tooltip" title="Mô tả">${
            activity.description
          }</textarea>
        <textarea type="text" id="location" class="swal2-textarea" style="height:40px;width:350px"
          placeholder="Địa điểm" tooltip="tooltip" title="Địa điểm">${
            activity.location
          }</textarea>
        <input type="datetime-local" id="startTime" class="swal2-input" tooltip="tooltip" title="Bắt đầu"
          style="height:40px;width:350px" value="${activity.startTime.replace(
            "Z",
            ""
          )}" />
        <input type="datetime-local" id="endTime" class="swal2-input" tooltip="tooltip" title="Kết thúc"
          style="height:40px;width:350px" value="${activity.endTime.replace(
            "Z",
            ""
          )}" />
        <input type="number" id="accumulatedTime" class="swal2-input" tooltip="tooltip" title="Giờ tích lũy"
          style="height:40px;width:350px" placeholder="Giờ tích lũy" value="${
            activity.accumulatedTime
          }" />
        <select id="activityType" class="swal2-input" tooltip="tooltip" title="Loại hoạt động"
          style="height:40px;width:350px">
          ${options}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#name").value;
        const description = Swal.getPopup().querySelector("#description").value;
        const location = Swal.getPopup().querySelector("#location").value;
        const startTime = Swal.getPopup().querySelector("#startTime").value;
        const endTime = Swal.getPopup().querySelector("#endTime").value;
        const accumulatedTime =
          Swal.getPopup().querySelector("#accumulatedTime").value;
        const activityType =
          Swal.getPopup().querySelector("#activityType").value;
        const now = new Date();
        const s = new Date(startTime);
        const e = new Date(endTime);
        if (!name || !location || !accumulatedTime) {
          Swal.showValidationMessage("Vui lòng nhập đủ thông tin");
          return false;
        }
        if (s >= e) {
          Swal.showValidationMessage(
            "Thời gian kết thúc phải sau thời gian bắt đầu"
          );
          return false;
        }
        if (e < now) {
          Swal.showValidationMessage("Thời gian kết thúc phải sau hiện tại");
          return false;
        }
        const updatedActivity = {
          name: name,
          description: description,
          location: location,
          startTime: startTime,
          endTime: endTime,
          accumulatedTime: accumulatedTime,
          activityType: activityType,
        };
        return axios
          .put(`/activities/update/${id}`, updatedActivity)
          .then((response) => {
            fetchData();
            handleSortChange("updatedAt", "DESC");
            toast.success("Chỉnh sửa thành công");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Có lỗi xảy ra khi chỉnh sữa hoạt động");
          });
      },
    });
  };
  //xóa
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn hoạt động này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/activities/delete/${id}`)
          .then((response) => {
            // Reload the FAQ data after deleting
            fetchData();
            toast.success("Xóa thành công");
          })
          .catch((error) => {
            if (error.response.data.message === "ISUSE") {
              toast.error("Không thể xóa! Hoạt động đã được đăng ký!");
            }
            console.error(error);
          });
      }
    });
  };

  return activities === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Danh sách hoạt động</Label>
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
          <Badge color="white">Chế độ sắp xếp:</Badge>
          <Badge onClick={() => handleRefresh()} color="failure">
            Làm mới
          </Badge>
          <Badge
            onClick={() => handleSortChange("createdAt", "DESC")}
            color="purple"
          >
            Ngày tạo
          </Badge>
          <Badge color="success">Từ</Badge>
          <TextInput
            id="startTime"
            type="date"
            required={true}
            style={{ height: "21px", width: "125px" }}
            onChange={handleStartTimeChange}
            value={startTime}
          />
          <Badge color="success">Đến</Badge>
          <TextInput
            id="endTime"
            type="date"
            required={true}
            style={{ height: "21px", width: "125px" }}
            value={endTime}
            onChange={handleEndTimeChange}
          />
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
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap ">
        <Badge color="info">Loại hoạt động: </Badge>
          <Dropdown
            label={activityType === "" ? "Tất cả" : activityType}
            style={{ height: "21px", width: "410px" }}
            color="greenToBlue"
          >
            <Dropdown.Item onClick={() => handleTypeChange("")}>
              Tất cả
            </Dropdown.Item>
            {type.map((item) => (
            <Dropdown.Item key={item.id} value={item.name} onClick={() => handleTypeChange(item.name)}>
              {item.name}
            </Dropdown.Item>
          ))}
          </Dropdown>
          <Badge color="warning">Trạng thái:</Badge>
          <Dropdown
            label={status === "" ? "Tất cả" : status}
            style={{ height: "21px", width: "150px" }}
            color="greenToBlue"
          >
            <Dropdown.Item onClick={() => handleStatusChange("")}>
              Tất cả
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("Sắp diễn ra")}>
              Sắp diễn ra
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("Đang diễn ra")}>
              Đang diễn ra
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("Đã kết thúc")}>
              Đã kết thúc
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <Table hoverable={true}>
        <Table.Head className={activeClassname}>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("name", "ASC")}>
            Tên hoạt động
          </Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("startTime", "ASC")}>
            Từ
          </Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("endTime", "ASC")}>
            Đến
          </Table.HeadCell>
          <Table.HeadCell>Trạng thái</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {activities.map((item, index) => {
            // const userActivity = activityOfUser.find((a) => a.id === item.id);
            // const userActivityId = userActivity ? userActivity.id : null;

            return (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={item.id}
              >
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell
                  onClick={() => showFormInfo(item.id)}
                  className="whitespace-normal font-medium text-gray-900 dark:text-white"
                >
                  {item.name}
                </Table.Cell>
                <Table.Cell
                  onClick={() => showFormInfo(item.id)}
                  className="whitespace-normal font-medium text-gray-900 dark:text-white"
                >
                  {new Date(item.startTime).toLocaleTimeString("en-GB") +
                    " " +
                    new Date(item.startTime).toLocaleDateString("en-GB") ?? ""}
                </Table.Cell>
                <Table.Cell
                  onClick={() => showFormInfo(item.id)}
                  className="whitespace-normal font-medium text-gray-900 dark:text-white"
                >
                  {new Date(item.endTime).toLocaleTimeString("en-GB") +
                    " " +
                    new Date(item.endTime).toLocaleDateString("en-GB") ?? ""}
                </Table.Cell>
                <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                  <Badge
                    style={{ width: "100px" }}
                    color={
                      {
                        "Sắp diễn ra": "warning",
                        "Đang diễn ra": "success",
                        "Đã kết thúc": "failure",
                      }[item.status]
                    }
                    className="flex justify-center"
                  >
                    {item.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="whitespace-normal text-gray-900 dark:text-white">
                  <div className="flex justify-end">
                    <Button
                      style={{ height: "30px", width: "30px" }}
                      onClick={() => showFormEdit(item.id)}
                      className="mr-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      style={{ height: "30px", width: "30px" }}
                      onClick={() => handleDelete(item.id)}
                      className=" mr-1 bg-gradient-to-r from-pink-400 to-orange-500 text-white font-bold py-1 px-4 rounded"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <Button
                      onClick={() => {
                        showListUser(item.id);
                      }}
                      style={{ height: "30px", width: "30px" }}
                      className="bg-gradient-to-r from-pink-400 to-orange-500 text-white font-bold py-1 px-4 rounded"
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
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
