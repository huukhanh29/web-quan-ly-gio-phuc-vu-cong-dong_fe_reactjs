import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Badge, Card, Label, Pagination, Spinner, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../store/authSlice";
import Swal from "sweetalert2";
import "./Sweet.css";
import { toast } from "react-toastify";
import { Dropdown } from "flowbite";
export default function ListFaq() {
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [faq, setFaq] = useState([]);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const handleSortChange = (option) => {
    setSort({ sortBy: option, sortDir: "DESC" });
    setCurrentPage(0);
  };

  const fetchData = useCallback(async () => {
    try {
      const { data, headers } = await axios.get(
        `/faq/get/all?page=${currentPage}&size=${pageSize}&sortBy=${sort.sortBy}&sortDir=${sort.sortDir}`
      );
      setFaq(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [currentPage, dispatch, pageSize, sort]);

  useEffect(() => {
    document.title = "Danh sách câu hỏi";
    fetchData();
  }, [fetchData]);
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
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
            handleSortChange("updatedAt")
            toast.success("Chỉnh sửa thành công");
          })
          .catch((error) => {
            console.error(error);
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
          Swal.showValidationMessage("Vui lòng nhập câu hỏi và trả lời");
        }
        return { question, answer };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = result.value;
        axios
          .post("/faq/create", newData)
          .then((response) => {
            // Reload the FAQ data after creating
            fetchData();
            toast.success("Thêm thành công");
          })
          .catch((error) => {
            console.error(error);
          });
      }
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
            console.error(error);
          });
      }
    });
  };

  return faq === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Danh sách câu hỏi</Label>
        <button
          onClick={() => showFormCreate()}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="ml-2">Thêm</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge onClick={() => handleSortChange("question")} color="info">Default</Badge>
        <Badge onClick={() => handleSortChange("answer")} color="gray">Dark</Badge>
        <Badge onClick={() => handleSortChange("createdAt")} color="green">Dark</Badge>
      </div>
      <Pagination
        className="flex justify-center"
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Table hoverable={true}>
        <Table.Head className={activeClassname}>
          <Table.HeadCell>Câu hỏi</Table.HeadCell>
          <Table.HeadCell>Trả lời</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {faq.map((item, index) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={item.id}
            >
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
                {item.question}
              </Table.Cell>
              <Table.Cell className="whitespace-normal  text-gray-900 dark:text-white">
                {item.answer}
              </Table.Cell>
              <Table.Cell className="whitespace-normal text-gray-900 dark:text-white">
                <div className="flex justify-end">
                  <button
                    id="faqId"
                    onClick={() => showFormEdit(item.id)}
                    className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
