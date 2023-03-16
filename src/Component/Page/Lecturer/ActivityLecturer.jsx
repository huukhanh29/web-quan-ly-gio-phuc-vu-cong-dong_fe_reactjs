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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import Swal from "sweetalert2";
import "./Activity.css";
import { setToken } from "../../../store/authSlice";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
export default function ActivityLecturer() {
  const dispatch = useDispatch();
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const id = decoded.id;
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activities, setActivities] = useState([]);
  const [isAll, setIsAll] = useState(true);
  const [activityOfUser, setActivityOfUser] = useState([]);
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      size: pageSize,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
      searchTerm: searchTerm,
      status: status,
      startTime: startTime ? startTime : null,
      endTime: endTime ? endTime : null,
    }),
    [
      currentPage,
      pageSize,
      sort.sortBy,
      sort.sortDir,
      searchTerm,
      status,
      startTime,
      endTime,
    ]
  );
  const handleAll = () => {
    setIsAll(true);
  };

  const handleMy = () => {
    setIsAll(false);
  };
  const fetchData = useCallback(async () => {
    try {
      let url = "/activities/get/all";
      if (!isAll) {
        url += `?userId=${id}`;
      }
      const { data } = await axios.get(url, { params: queryParams });
      setActivities(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch, isAll, id, queryParams]);
  const getActivityOfUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/get/of/${id}`);
      setActivityOfUser(data);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    document.title = "Danh sách hoạt động";
    getActivityOfUser();
    fetchData();
  }, [fetchData, getActivityOfUser]);
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
  };
  const handleSortChange = (sortBy, sortDir) => {
    setSort({ sortBy: sortBy, sortDir: sortDir });
    setCurrentPage(0);
  };
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
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
  //đăng ký
  const handleRegister = (activityId) => {
    const updatedData = { userId: id, activityId: activityId };
    axios
      .post("/activities/register", updatedData)
      .then((response) => {
        fetchData();
        getActivityOfUser();
        toast.success("Đăng ký thành công");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //hủy
  const handleDestroy = (activityId) => {
    axios
      .delete(`/activities/manager/destroy/${id}/${activityId}`)
      .then((response) => {
        fetchData();
        getActivityOfUser();
        toast.success("Hủy thành công");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return activities === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Danh sách hoạt động</Label>
        <div className="flex items-center">
          <Button.Group className="mr-7">
            <Button
              onClick={handleAll}
              color="gray"
              style={{ height: "30px", width: "100px" }}
            >
              Tất cả
            </Button>
            <Button
              onClick={handleMy}
              color="gray"
              style={{ height: "30px", width: "100px" }}
            >
              Của tôi
            </Button>
          </Button.Group>
          <TextInput
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleInputChange}
            className="py-1 mr-2"
            style={{ height: "30px", width: "300px" }}
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
          <Badge onClick={() => handleRefresh()} color="gray">
            Refresh
          </Badge>
          <Badge
            onClick={() => handleSortChange("createdAt", "DESC")}
            color="failure"
          >
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
            const userActivity = activityOfUser.find((a) => a.id === item.id);
            const status = userActivity ? userActivity.status : null;

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
                <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                  <Badge
                    onClick={
                      !status && item.status === "Sắp diễn ra"
                        ? () => handleRegister(item.id)
                        : item.status !== "Sắp diễn ra"
                        ? () => showFormInfo(item.id)
                        : undefined
                    }
                    color={
                      {
                        "Đã duyệt": "success",
                        "Đã xác nhận": "failure",
                      }[status]
                    }
                    className="flex justify-center"
                  >
                    {status
                      ? status
                      : item.status !== "Sắp diễn ra"
                      ? "Xem"
                      : "Đăng ký"}
                  </Badge>
                  {(status === "Chờ duyệt" || status === "Chờ xác nhận") && (
                    <Badge onClick={() => handleDestroy(item.id)}
                    color="failure" className="flex justify-center">
                      Hủy
                    </Badge>
                  )}
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
