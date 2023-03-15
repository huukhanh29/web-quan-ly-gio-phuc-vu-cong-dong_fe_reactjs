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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { setToken } from "../../../../store/authSlice";
import jwt_decode from "jwt-decode";
import "./../../Admin/Faq/Sweet.css";
export default function ListFeedback() {
  const dispatch = useDispatch();
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const id = decoded.id;
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [feedback, setFeedbacks] = useState([]);
  const [sort, setSort] = useState({ sortBy: "", sortDir: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetchingAll, setIsFetchingAll] = useState(true);

  const queryParams = useMemo(() => ({
    page: currentPage,
    size: pageSize,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
    searchTerm: searchTerm,
  }), [currentPage, pageSize, sort.sortBy, sort.sortDir, searchTerm]);
  
  const handleAll =() =>{
    setIsFetchingAll(true);
  }
  
  const handleMy =() =>{
    setIsFetchingAll(false);
  }
  
  const fetchData = useCallback(async () => {
    try {
      let url = '/feedback/get/all';
      if(!isFetchingAll) {
        url += `?userId=${id}`;
      }
      const { data } = await axios.get(url, { params: queryParams });
      setFeedbacks(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch, isFetchingAll, id, queryParams]);
  

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
            onClick={() => handleSortChange("id","ASC")}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        
        <div className="flex flex-wrap gap-2 ml-9">
          <Badge onClick={() => handleRefresh("id")} color="gray">
            Refresh
          </Badge>
          <Badge
            onClick={handleAll}
            color="failure"
          >
            All
          </Badge>
          <Badge
            onClick={handleMy}
            color="warning"
          >
            Myself
          </Badge>
          <Badge onClick={() => handleSortChange("id", "ASC")} color="info">
            Id
          </Badge>
          <Badge
            onClick={() => handleSortChange("content", "ASC")}
            color="success"
          >
            Content
          </Badge>
          
          <Badge
            onClick={() => handleSortChange("createdAt", "DESC")}
            color="pink"
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
          <Table.HeadCell>Nội dung</Table.HeadCell>
          <Table.HeadCell>Từ khóa</Table.HeadCell>
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
