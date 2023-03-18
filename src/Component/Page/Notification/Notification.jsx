import { Button, Card, Spinner, Table } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch, useStore } from "react-redux";
import { setMesage, setToken } from "../../../store/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
export default function Notification() {
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const userId = decoded.id;
  const dispatch = useDispatch();
  const [notification1, setNotification1] = useState([]);
  const [notification2, setNotification2] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [notification, setNotification] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/notifications/get/${userId}`);
      setNotifications(data);
      const readNotifications1 = data.filter(
        (item) => item.status === "Chưa đọc"
      );
      setNotification1(readNotifications1);
      const readNotifications2 = data.filter(
        (item) => item.status === "Đã đọc"
      );
      setNotification2(readNotifications2);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch, userId]);

  useEffect(() => {
    document.title = "Thông báo";
    if (notification1.length > 0) {
      dispatch(setMesage(notification1.length));
    } else {
      dispatch(setMesage(null));
    }
    fetchData();
  }, [fetchData, dispatch, notification1]);
  const handleClick = (notiId) => {
    const notifi = notifications.find((item) => item.id === notiId);
    setNotification(notifi);
  };
  //Đánh dấu đọc
  const handleRead = (notiId) => {
    axios
      .put(`/notifications/status/${notiId}`)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //xóa một thông báo
  const handleDeleteOne = (notiId) => {
    axios
      .delete(`/notifications/delete/${notiId}`)
      .then((response) => {
        fetchData();
        setNotification(null);
        toast.success("Đã xóa");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //xóa tất cả thông báo
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
          .delete(`/notifications/delete/all/${userId}`)
          .then((response) => {
            fetchData();
            setNotification2(null);
            setNotification(null);
            toast.success("Đã xóa tất cả các tin đã đọc");
          })
          .catch((error) => {
            console.log(error);
            if (error.response.data.message === "NOT FOUND") {
              toast.warning("Không có tin đã đọc!");
            }
          });
      }
    });
  };
  return notifications === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex">
        <div className="w-1/2 p-4">
          <Card style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <Button
              className="bg-red-500 text-white rounded"
              style={{ height: "30px", width: "120px" }}
              onClick={handleDeleteAll}
            >
              Xóa tất cả
            </Button>
            <Table hoverable={true}>
              <Table.Head className="bg-gradient-to-r from-green-300 to-blue-400">
                <Table.HeadCell> Thông báo </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y border rounded-lg">
                <Table.Row>
                  <Table.Cell
                    className="whitespace-normal font-medium text-gray-400 dark:text-white"
                    style={{ height: "20px", padding: "0 0 0 25px" }}
                  >
                    Chưa đọc
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
              {notification1 && (
                <Table.Body className="divide-y">
                  {notification1.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell
                        onClick={() => {
                          handleClick(item.id);
                          handleRead(item.id);
                        }}
                        className="whitespace-normal font-medium text-gray-900 dark:text-white"
                      >
                        {item.title}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
              <Table.Body className="divide-y border rounded-lg">
                <Table.Row>
                  <Table.Cell
                    className="whitespace-normal font-medium text-gray-400 dark:text-white"
                    style={{ height: "20px", padding: "0 0 0 25px" }}
                  >
                    Đã đọc
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
              {notification2 && (
                <Table.Body className="divide-y">
                  {notification2.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell
                        onClick={() => {
                          handleClick(item.id);
                          handleRead(item.id);
                        }}
                        className="whitespace-normal font-medium text-gray-900 dark:text-white"
                      >
                        {item.title}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
            </Table>
          </Card>
        </div>
        {notification !== null && (
          <div className="w-1/2 p-4">
            <Card>
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-lg">{notification.content}</p>
                </div>
                <div className="col-span-2 sm:col-span-1 flex justify-between items-center">
                  <p className="text-sm">
                    {new Date(notification.createdAt).toLocaleTimeString(
                      "en-GB"
                    ) +
                      " " +
                      new Date(notification.createdAt).toLocaleDateString(
                        "en-GB"
                      ) ?? ""}
                  </p>
                  <button
                    onClick={() => handleDeleteOne(notification.id)}
                    className="bg-red-500 text-white rounded"
                    style={{ height: "30px", width: "50px" }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
}
