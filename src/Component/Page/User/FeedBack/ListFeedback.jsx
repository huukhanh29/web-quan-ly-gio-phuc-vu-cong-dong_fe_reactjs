import axios from "axios";
import { Card, Label, Spinner, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../store/authSlice";

export default function ListFeedback() {
  const [contents, setContens] = useState(null);
  const dispatch = useDispatch()
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const fetchData = useCallback(async () => {
    try {
      const { data, status } = await axios.get("/feedback/get/all");
      if (status === 200) {
        setContens(data);
      }
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  },[dispatch]);
  useEffect(() => {
    document.title= "Danh sách phản hồi"
    fetchData()
  }, [fetchData]);
  return contents===null?<Spinner color="failure"/>:(
    
    <Card>
      <Label className="text-xl">Danh sách phản hồi</Label>
      <Table hoverable={true}>
        <Table.Head className={activeClassname}>
          <Table.HeadCell>Content</Table.HeadCell>
          <Table.HeadCell>Question</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
            {contents.map((item, index)=>(
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {item.content}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {item.faq?.content ?? ""}
            </Table.Cell>
          </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
