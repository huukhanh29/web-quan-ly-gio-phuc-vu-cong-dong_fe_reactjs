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

export default function ManagerActivity() {
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [condition, setCondition] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [useractivity, setUserActivities] = useState([]);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/manager/get/all`, {
        params: {
          page: currentPage,
          size: pageSize,
          sortBy: sort.sortBy,
          sortDir: sort.sortDir,
          searchTerm: searchTerm,
          status: status,
          startTime: startTime ? startTime : null,
          endTime: endTime ? endTime : null,
          year: currentYear,
          condition: condition,
        },
      });
      setUserActivities(data.content);
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
    currentYear,
    condition
  ]);

  const getActivityYear = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/get/years`);
      setYears(data);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch]);
  useEffect(() => {
    document.title = "Danh sách hoạt động";
    getActivityYear();
    fetchData();
  }, [fetchData, getActivityYear]);
  const handelChangeYaer = (a) => {
    setCurrentYear(a);
  };
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
    setCondition("");
  };
  const handleStatusChange = (a) => {
    setStatus(a);
    fetchData();
  };
  const handleConditionChange = (a) => {
    setCondition(a);
    fetchData();
  };
  //xem chi tiết user
  const showUserActivityInfo = (userId) => {
    axios
      .get(`activities/manager/get/user-info/${userId}`)
      .then((response) => {
        const data = response.data;
        Swal.fire({
          title: "Thông tin",
          html: `
          <table class="swal2-table">
            <tr>
              <td>Tên</td>
              <td>${data.name}</td>
            </tr>
            <tr>
              <td>Chức danh</td>
              <td>${data.job}</td>
            </tr>
            <tr>
              <td>Hoạt động năm nay</td>
              <td>${data.numActivities}</td>
            </tr>
            <tr>
              <td>Tỉ lệ hoàn thành</td>
              <td>${data.totalHours}/${data.requiredHours}</td>
            </tr>
          </table>
        `,
          confirmButtonText: "OK",
          focusConfirm: false,
          allowOutsideClick: () => !Swal.isLoading(),
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          dispatch(setToken(""));
        }
      });
  };

  const showFormInfo = (id) => {
    const item = useractivity.find((item) => item.id === id);
    Swal.fire({
      title: "Thông tin",
      html: `
        <table class="swal2-table">
          <tr>
            <td>Tên</td>
            <td>${item.activity.name}</td>
          </tr>
          <tr>
            <td>Mô tả</td>
            <td>${item.activity.description}</td>
          </tr>
          <tr>
            <td>Địa điểm</td>
            <td>${item.activity.location}</td>
          </tr>
          <tr>
            <td>Bắt đầu</td>
            <td> ${
              new Date(item.activity.startTime).toLocaleTimeString("en-GB") +
                " " +
                new Date(item.activity.startTime).toLocaleDateString("en-GB") ??
              ""
            }</td>
          </tr>
          <tr>
            <td>Kết thúc</td>
            <td> ${
              new Date(item.activity.endTime).toLocaleTimeString("en-GB") +
                " " +
                new Date(item.activity.endTime).toLocaleDateString("en-GB") ??
              ""
            }</td>
          </tr>
          <tr>
            <td>Loại hoạt động</td>
            <td>${item.activity.activityType.name}</td>
          </tr>
          <tr>
            <td>Giờ tích lũy</td>
            <td>${item.activity.accumulatedTime}</td>
          </tr>
          <tr>
            <td>Trạng thái</td>
            <td>${item.activity.status}</td>
          </tr>
        </table>
      `,
      confirmButtonText: "OK",
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };
  //duyệt
  const handleApproved = (id, st) => {
    const item = useractivity.find((item) => item.id === id);
    const statusActivity = item.activity.status;
    const data = { status: st };
    if (
      (st === "Chờ xác nhận" && statusActivity === "Sắp diễn ra") ||
      (st === "Đã xác nhận" && statusActivity === "Đã kết thúc")
    ) {
      axios
        .post(`/activities/manager/update/status/${id}`, data)
        .then((response) => {
          fetchData();
          toast.success("Thành công");
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      toast.error("Không thể duyệt/xác nhận! Hết hạn duyệt/Chưa kết thúc!");
    }
  };
  return useractivity === null ? (
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
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap gap-2 ml-9">
          <Badge onClick={() => handleRefresh()} color="gray">
            Refresh
          </Badge>
          <Badge
            onClick={() => handleSortChange("activity.createdAt", "DESC")}
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
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap gap-2 ml-9">
        <Badge color="warning">Công việc:</Badge>
          <Dropdown
            label={condition === "" ? "Tất cả" : status}
            style={{ height: "21px", width: "150px" }}
            color="greenToBlue"
          >
            <Dropdown.Item onClick={() => handleConditionChange("")}>
              Tất cả
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleConditionChange("Chờ duyệt")}>
              Duyệt
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleConditionChange("Chờ xác nhận")}>
              Xác nhận
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleConditionChange("Đã xác nhận")}>
              Hoàn thành
            </Dropdown.Item>
          </Dropdown>

          <Badge color="warning">Năm:</Badge>
          <Dropdown
            label={currentYear}
            style={{ height: "21px", width: "50px" }}
            color="greenToBlue"
          >
            {years.map((year) => (
              <Dropdown.Item
                key={year}
                value={year}
                onClick={() => handelChangeYaer(year)}
              >
                {year}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      </div>
      <Table hoverable={true}>
        <Table.Head className={activeClassname}>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell
            onClick={() => handleSortChange("activity.name", "ASC")}
          >
            Tên hoạt động
          </Table.HeadCell>
          <Table.HeadCell
            onClick={() => handleSortChange("activity.startTime", "ASC")}
          >
            Từ
          </Table.HeadCell>
          <Table.HeadCell
            onClick={() => handleSortChange("activity.endTime", "ASC")}
          >
            Đến
          </Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("user.name", "ASC")}>
            Người đăng ký
          </Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {useractivity.map((item, index) => {
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
                  {item.activity.name}
                </Table.Cell>
                <Table.Cell
                  onClick={() => showFormInfo(item.id)}
                  className="whitespace-normal font-medium text-gray-900 dark:text-white"
                >
                  {new Date(item.activity.startTime).toLocaleTimeString(
                    "en-GB"
                  ) +
                    " " +
                    new Date(item.activity.startTime).toLocaleDateString(
                      "en-GB"
                    ) ?? ""}
                </Table.Cell>
                <Table.Cell
                  onClick={() => showFormInfo(item.id)}
                  className="whitespace-normal font-medium text-gray-900 dark:text-white"
                >
                  {new Date(item.activity.endTime).toLocaleTimeString("en-GB") +
                    " " +
                    new Date(item.activity.endTime).toLocaleDateString(
                      "en-GB"
                    ) ?? ""}
                </Table.Cell>
                <Table.Cell
                  onClick={() => showUserActivityInfo(item.user.id)}
                  className="whitespace-normal font-medium text-gray-900 dark:text-white"
                >
                  {item.user.name}
                </Table.Cell>
                <Table.Cell className="whitespace-normal text-gray-900 dark:text-white">
                  <div className="flex justify-end">
                    {item.status === "Chờ duyệt" && (
                      <Button
                        style={{ height: "30px", width: "100px" }}
                        onClick={() => handleApproved(item.id, "Chờ xác nhận")}
                        className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                      >
                        Duyệt
                      </Button>
                    )}
                    {item.status === "Chờ xác nhận" && (
                      <Button
                        style={{ height: "30px", width: "100px" }}
                        onClick={() => handleApproved(item.id, "Đã xác nhận")}
                        className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                      >
                        Xác nhận
                      </Button>
                    )}
                    {item.status === "Đã xác nhận" && (
                      <Button
                        style={{ height: "30px", width: "100px" }}
                        //onClick={() => handleApproved(item.id, "Chờ xác nhận")}
                        className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                      >
                        Xong
                      </Button>
                    )}
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
