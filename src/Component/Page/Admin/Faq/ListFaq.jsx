import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Card, Label, Spinner, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../store/authSlice";
import Swal from "sweetalert2";
import "./Sweet.css"
export default function ListFaq() {
  const [faq, setFaq] = useState(null);
  const dispatch = useDispatch();
  const activeClassname = "bg-gradient-to-r from-green-300 to-blue-400";
  const fetchData = useCallback(async () => {
    try {
      const { data, status } = await axios.get("/faq/get/all");
      if (status === 200) {
        setFaq(data);
      }
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch]);
  useEffect(() => {
    document.title = "Danh sách câu hỏi";
    fetchData();
  }, [fetchData]);
  const showFormEdit = (id) => {
    const faqItem = faq.find((item) => item.id === id);
    Swal.fire({
      title: "Chỉnh sửa",
      html: `<textarea type="text" id="question" class="swal2-textarea form-textarea" placeholder="Question">${faqItem.question}</textarea>
      <textarea type="text" id="answer" class="swal2-textarea form-textarea" placeholder="Answer">${faqItem.answer}</textarea>`,

      confirmButtonText: "Lưu",
      focusConfirm: false,
      preConfirm: () => {
        const question = Swal.getPopup().querySelector("#question").value;
        const answer = Swal.getPopup().querySelector("#answer").value;
        if (!question || !answer) {
          Swal.showValidationMessage(`Please enter question and answer`);
        }
        return { question: question, answer: answer };
      },
    }).then((result) => {
      const updatedData = result.value;
      axios
        .put(`/faq/update/${id}`, updatedData)
        .then((response) => {
          // Reload the FAQ data after updating
          fetchData();
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };
  return faq === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <Label className="text-xl">Danh sách câu hỏi</Label>
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
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded">
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
