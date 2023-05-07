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
import "./Sweet.css";
import { toast } from "react-toastify";
export default function ListFaq() {
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [faq, setFaq] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/faq/get/all?page=${currentPage}&size=${pageSize}&sortBy=${sort.sortBy}&sortDir=${sort.sortDir}&searchTerm=${searchTerm}`
      );

      setFaq(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [currentPage, dispatch, pageSize, sort, searchTerm]);

  useEffect(() => {
    document.title = "Danh sách câu hỏi";
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
  //chỉnh sửa
  const showFormEdit = (id) => {
    const faqItem = faq.find((item) => item.id === id);
    Swal.fire({
      title: "Chỉnh sửa",
      html: `<textarea type="text" id="question" class="swal2-textarea form-textarea " placeholder="Question">${faqItem.question}</textarea>
      <textarea type="text" id="answer" class="swal2-textarea form-textarea" placeholder="Answer">${faqItem.answer}</textarea>`,
      confirmButtonText: "Lưu",
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        const question = Swal.getPopup().querySelector("#question").value;
        const answer = Swal.getPopup().querySelector("#answer").value;
        if (!question || !answer) {
          Swal.showValidationMessage(`Please enter question and answer`);
        }
        //const existingQuestion = faq.find((item) => item.question === question);
        // if (existingQuestion) {
        //   Swal.showValidationMessage("Câu hỏi đã tồn tại");
        //   return false;
        // }
        return { question: question, answer: answer };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = result.value;
        axios
          .put(`/faq/update/${id}`, updatedData)
          .then((response) => {
            // Reload the FAQ data after updating
            fetchData();
            handleSortChange("updatedAt", "DESC");
            toast.success("Chỉnh sửa thành công");
          })
          .catch((error) => {
            if (error.response.status === 403) {
              dispatch(setToken(""));
            }
          });
      }
    });
  };
  //thêm mới
  const showFormCreate = () => {
    Swal.fire({
      title: "Thêm câu hỏi mới",
      html: `<textarea type="text" id="question" class="swal2-textarea form-textarea " placeholder="Question"></textarea>
      <textarea type="text" id="answer" class="swal2-textarea form-textarea" placeholder="Answer"></textarea>`,
      focusConfirm: false,
      preConfirm: () => {
        const question = Swal.getPopup().querySelector("#question").value;
        const answer = Swal.getPopup().querySelector("#answer").value;
        if (!question || !answer) {
          Swal.showValidationMessage("Vui lòng nhập câu hỏi và trả lờiz");
          return false;
        }
        const newData = { question, answer };
        // Kiểm tra trùng lặp câu hỏi
        const existingQuestion = faq.find((item) => item.question === question);
        if (existingQuestion) {
          Swal.showValidationMessage("Câu hỏi đã tồn tại");
          return false;
        }
        axios
          .post("/faq/create", newData)
          .then((response) => {
            // Reload the FAQ data after creating
            fetchData();
            handleSortChange("createdAt", "DESC");
            toast.success("Thêm thành công");
          })
          .catch((error) => {
            console.log(error);
          });
      },
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
          .delete(`/faq/delete/${id}`)
          .then((response) => {
            // Reload the FAQ data after deleting
            fetchData();
            toast.success("Xóa thành công");
          })
          .catch((error) => {
            if (error.response.data.message === "IS USE") {
              toast.error("Không thể xóa! Do đã lưu trữ thống kê!")
            }
          });
      }
    });
  };
  //chi tiết
  const showFormInfo = (id) => {
    const item = faq.find((item) => item.id === id);
    Swal.fire({
      title: "Thông tin",
      html: `<textarea type="text" id="question" class="swal2-textarea form-textarea " placeholder="Question" disabled>${item.question}</textarea>
      <textarea type="text" id="answer" class="swal2-textarea form-textarea" placeholder="Answer" disabled>${item.answer}</textarea>
      <p>Số lượt hỏi: ${item.uniqueHistoryCount}</p>`,
      confirmButtonText: "OK",
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };
  return faq === null ? (
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
            color="success"
          >
            Ngày cập nhật
          </Badge>
          <Badge
            onClick={() => handleSortChange("uniqueHistoryCount", "DESC")}
            color="purple"
          >
            Hỏi nhiều
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
          <Table.HeadCell onClick={() => handleSortChange("question", "ASC")}>
            Câu hỏi
          </Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("answer", "ASC")}>
            Trả lời
          </Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {faq.map((item, index) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={item.id}
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell
                onClick={() => showFormInfo(item.id)}
                className="whitespace-normal font-medium text-gray-900 dark:text-white"
              >
                {item.question}
              </Table.Cell>
              <Table.Cell
                onClick={() => showFormInfo(item.id)}
                className="whitespace-normal  text-gray-900 dark:text-white"
              >
                {item.answer?.length > 50
                  ? item.answer.slice(0, 50) + "..."
                  : item.answer}
              </Table.Cell>
              <Table.Cell className="whitespace-normal text-gray-900 dark:text-white">
                <div className="flex justify-end">
                  <Button
                    style={{ height: "30px", width: "30px" }}
                    onClick={() => showFormEdit(item.id)}
                    className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
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
