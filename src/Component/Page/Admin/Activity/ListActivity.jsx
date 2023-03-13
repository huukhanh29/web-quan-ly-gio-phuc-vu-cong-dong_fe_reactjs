import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
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
  TextInput
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
  const [type, setTypes] = useState("");
  const [activities, setActivities] = useState([]);
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
  };
  const handleStatusChange = (a) => {
    setStatus(a);
    fetchData();
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

  //thêm mới
  const showFormCreate = async () => {
    await getType();
    const options = type
      .map((item) => `<option value="${item.name}">${item.name}</option>`)
      .join("");
    Swal.fire({
      title: "Thêm hoạt động",
      html: `
        <textarea type="text" id="name" class="swal2-textarea" style="height:50px;width:350px"
          placeholder="Tên hoạt động" tooltip="tooltip" title="Tên hoạt động"></textarea>
        <textarea type="text" id="description" class="swal2-textarea" style="height:50px;width:350px"
          placeholder="Mô tả" tooltip="tooltip" title="Mô tả"></textarea>
        <textarea type="text" id="location" class="swal2-textarea" style="height:50px;width:350px"
          placeholder="Địa điểm" tooltip="tooltip" title="Địa điểm"></textarea>
        <input type="datetime-local" id="startTime" class="swal2-input" tooltip="tooltip" title="Bắt đầu"
          style="width:350px" />
        <input type="datetime-local" id="endTime" class="swal2-input" tooltip="tooltip" title="Kết thúc"
          style="width:350px"/>
        <input type="number" id="accumulatedTime" class="swal2-input" tooltip="tooltip" title="Giờ tích lũy"
          style="width:350px" placeholder="Giờ tích lũy"/>
        <select id="activityType" class="swal2-input" tooltip="tooltip" title="Loại hoạt động"
          style="width:350px">
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
        const accumulatedTime = Swal.getPopup().querySelector("#accumulatedTime").value;
        const activityType = Swal.getPopup().querySelector("#activityType").value;
        const now= new Date();
        const s= new Date(startTime);
        const e = new Date(endTime)
        console.log(s)
        if (!name || !location || !accumulatedTime) {
          Swal.showValidationMessage("Vui lòng nhập đủ thông tin");
          return false;
        }
        if (s < now) {
          Swal.showValidationMessage("Thời gian bắt đầu phải sau thời điểm hiện tại");
          return false;
        }
  
        if (s >= e) {
          Swal.showValidationMessage("Thời gian kết thúc phải sau thời gian bắt đầu");
          return false;
        }
        const body = {
          name: name,
          description: description,
          location: location,
          startTime: startTime,
          endTime: endTime,
          accumulatedTime: accumulatedTime,
          activityType: activityType
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
            toast.error("Có lỗi xảy ra khi thêm hoạt động")
          });
      },
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
          <Badge onClick={() => handleRefresh()} color="gray">
            Refresh
          </Badge>
          <Badge onClick={() =>  handleSortChange("createdAt", "DESC")} color="failure">
            Create
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
            <Dropdown.Item onClick={() => handleStatusChange("Đã diễn ra")}>
              Đã diễn ra
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
          {activities.map((item, index) => (
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
                    //onClick={() => showFormEdit(item.id)}
                    className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    style={{ height: "30px", width: "30px" }}
                    //onClick={() => handleDelete(item.id)}
                    className="bg-gradient-to-r from-pink-400 to-orange-500 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} />
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
