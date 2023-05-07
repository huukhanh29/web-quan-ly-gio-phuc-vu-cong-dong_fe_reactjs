import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { format } from 'date-fns'
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
import { useDispatch, useStore } from "react-redux";
import { setToken } from "../../../../store/authSlice";
import Swal from "sweetalert2";
import "./../../Admin/Faq/Sweet.css";
export default function History() {
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [history, setHistories] = useState([]);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const userId = decoded.id;
  const fetchData = useCallback(async () => {
    try {
    
      const { data } = await axios.get(
        `/user/${userId}/chat?page=${currentPage}&size=${pageSize}&sortBy=${sort.sortBy}&sortDir=${sort.sortDir}&searchTerm=${searchTerm}`
      );
      setHistories(data.content);
      setTotalPages(data.totalPages);
      //console.log(data)
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [currentPage, dispatch, pageSize, sort, searchTerm, userId]);

  useEffect(() => {
    document.title = "Lịch sử";
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
  // const handleRefresh = () => {
  //   setSearchTerm("");
  //   setSort({ sortBy: "id", sortDir: "DESC" });
  //   setPageSize(10);
  //   setCurrentPage(0);
  // };
  const showFormInfo = (id) => {
    const item = history.find((item) => item.id === id);
    Swal.fire({
      title: "Thông tin",
      html: `<textarea type="text" id="question" class="swal2-textarea form-textarea " placeholder="Question" disabled>${item.question}</textarea>
      <textarea type="text" id="answer" class="swal2-textarea form-textarea" placeholder="Answer" disabled>${item.answer}</textarea>`,
      confirmButtonText: "OK",
      focusConfirm: false,
      allowOutsideClick: () => !Swal.isLoading(),
      
    })
  };
  return history === null ? (
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
            onClick={() => handleSortChange("createdAt","DESC")}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
      <div className="flex flex-wrap gap-2 ml-9">
      <Badge color="white">Số lượng hàng:</Badge>
          
        <Dropdown label={pageSize} style={{ height: "21px", width : "50px" }} color="greenToBlue">
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
          <Table.HeadCell onClick={() => handleSortChange("faq.question","ASC")}>Câu hỏi</Table.HeadCell>
          <Table.HeadCell onClick={() => handleSortChange("faq.answer","ASC")}>Trả lời</Table.HeadCell>
          <Table.HeadCell>Thời gian</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {history.map((item, index) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={index}
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
              {item.question??""}
              </Table.Cell>
              <Table.Cell className="whitespace-normal  text-gray-900 dark:text-white">
                {item.answer?.length > 50
                  ? item.answer.slice(0, 50) + "..."
                  : item.answer}
              </Table.Cell>
              <Table.Cell className="whitespace-normal font-medium text-gray-900 dark:text-white">
              {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm:ss')}
              </Table.Cell>
              <Table.Cell className="whitespace-normal text-gray-900 dark:text-white">
                <div className="flex justify-end">
                <Button
                    style={{ height: '30px', width: "30px" }}
                    onClick={() => showFormInfo(item.id)}
                    className="mr-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-1 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faInfo} />
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
