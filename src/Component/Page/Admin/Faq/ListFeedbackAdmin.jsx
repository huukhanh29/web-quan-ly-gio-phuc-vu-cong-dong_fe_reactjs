import { faEdit, faInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import { useDispatch} from "react-redux";
import { setToken } from "../../../../store/authSlice";
import Swal from "sweetalert2";
import "./Sweet.css";
import { toast } from "react-toastify";

export default function ListFeedbackAdmin() {
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [feedback, setFeedbacks] = useState([]);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/feedback/get/all?page=${currentPage}&size=${pageSize}&sortBy=${sort.sortBy}&sortDir=${sort.sortDir}&searchTerm=${searchTerm}`
      );

      setFeedbacks(data.content);
      setTotalPages(data.totalPages);
      //console.log(data)
    } catch (error) {
      // if (error.response.status === 403) {
      dispatch(setToken(""));
      //}
    }
  }, [currentPage, dispatch, pageSize, sort, searchTerm]);

  useEffect(() => {
    document.title = "Danh sách phản hồi";
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
  //thêm mới
  const showFormCreate = (id) => {
    const feedbackItem = feedback.find((item) => item.id === id);
    Swal.fire({
      title: "Trả lời phản hồi",
      html: `
      <textarea type="text" id="name" class="swal2-textarea form-textarea" style="height:80px" disabled>${feedbackItem.content}</textarea>
      <textarea type="text" id="question" class="swal2-textarea form-textarea " style="height:80px" placeholder="Question"></textarea>
      <textarea type="text" id="answer" class="swal2-textarea form-textarea" style="height:80px" placeholder="Answer"></textarea>`,
      focusConfirm: false,
      preConfirm: () => {
        const question = Swal.getPopup().querySelector("#question").value;
        const answer = Swal.getPopup().querySelector("#answer").value;
        if (!question || !answer) {
          Swal.showValidationMessage("Vui lòng nhập câu hỏi và trả lời");
          return false;
        }
        const newData = { question, answer };

        axios
          .post(`/feedback/reply/${id}`, newData)
          .then((response) => {
            // Reload the FAQ data after creating
            fetchData();
            handleSortChange("createdAt", "DESC");
            toast.success("Thêm thành công");
          })
          .catch((error) => {
            if (error.response.data.message === "Question already exists") {
              toast.warning("Câu hỏi đã tồn tại");
            }
            console.log(error);
          });
      },
    });
  };
  //thêm mới
  const handleInfo = (id) => {
    const feedbackItem = feedback.find((item) => item.id === id);
    Swal.fire({
      title: "Thông tin trả lời",
      html: `
      <textarea type="text" id="name" class="swal2-textarea form-textarea" style="height:80px" disabled>${feedbackItem.content}</textarea>
      <textarea type="text" id="question" class="swal2-textarea form-textarea " style="height:80px" placeholder="Question" disabled>${feedbackItem.question}</textarea>
      <textarea type="text" id="answer" class="swal2-textarea form-textarea" style="height:80px" placeholder="Answer" disabled>${feedbackItem.answer}</textarea>`,
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };
  //xóa
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa câu hỏi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/feedback/delete/${id}`)
          .then((response) => {
            // Reload the FAQ data after deleting
            fetchData();
            toast.success("Xóa thành công");
          })
          .catch((error) => {
            
            console.error(error);
          });
      }
    });
  };
  //xóa tất cả
  const handleDeleteAll = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa tất cả?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/feedback/delete/all`)
          .then((response) => {
            fetchData();
            toast.success("Đã xóa tất cả các phản hồi đã trả lời");
          })
          .catch((error) => {
            console.log(error);
            if (error.response.data.message === "NOT FOUND") {
              toast.warning("Không có phản hồi đã trả lời!");
            }
          });
      }
    });
  };
  return feedback === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Danh sách câu hỏi</Label>
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
        <Button
              className="bg-red-500 text-white rounded"
              style={{ height: "21px", width: "120px" }}
              onClick={handleDeleteAll}
            >
              Xóa tất cả
            </Button>
        <Badge color="white">Chế độ sắp xếp:</Badge>
          <Badge onClick={() => handleRefresh("id")} color="failure">
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
          <Badge  color="white">
            Số hàng: 
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
          <Table.HeadCell onClick={() => handleSortChange("content", "ASC")}>Nội dung</Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("faq.question", "ASC")}>Từ khóa</Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("user.name", "ASC")}>Người gửi</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {feedback.map((item, index) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={item.id}
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                {item.content}
              </Table.Cell>
              <Table.Cell className="whitespace-normal  text-gray-900 dark:text-white">
                {item.question}
              </Table.Cell>
              <Table.Cell className="whitespace-normal  text-gray-900 dark:text-white">
                {item.name}
              </Table.Cell>
              <Table.Cell className="whitespace-normal text-gray-900 dark:text-white">
                <div className="flex justify-end">
                  {item.question === null ? (
                    <Button
                      style={{ height: "30px", width: "30px" }}
                      onClick={() => showFormCreate(item.id)}
                      className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  ) : (
                    <Button
                      style={{ height: "30px", width: "30px" }}
                      onClick={() => handleInfo(item.id)}
                      className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                    >
                      <FontAwesomeIcon icon={faInfo} />
                    </Button>
                  )}

                  <Button
                    style={{ height: "30px", width: "30px" }}
                    onClick={() => handleDelete(item.id)}
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
