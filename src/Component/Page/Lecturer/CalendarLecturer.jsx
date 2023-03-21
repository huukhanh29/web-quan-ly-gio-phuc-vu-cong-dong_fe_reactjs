import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Label } from "flowbite-react";
import { useDispatch, useStore } from "react-redux";
import axios from "axios";
import { setToken } from "../../../store/authSlice";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

const localizer = momentLocalizer(moment);

export default function CalendarLecturer() {
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const id = decoded.id;
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/get/of/${id}`);
      const activity = data.filter(
        (item) =>
          item.status === "Chờ xác nhận" || item.status === "Đã xác nhận"
      );
      setActivities(activity)
      setEvents(
        activity.map((activity) => ({
          start: activity.startTime,
          end: activity.endTime,
          title: activity.name,
          id: activity.id
        }))
      );
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    document.title = "Lịch hoạt động";
    fetchData();
  }, [fetchData]);
  const handleSelectEvent = (event) => {
    const item = activities.find((item) => item.id === event.id);
    Swal.fire({
      title: 'Thông tin sự kiện',
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
  return (
    <Card>
      <Label className="text-xl">Lịch trình hoạt động</Label>
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        views={{ month: true, agenda: true }}
        events={events}
        style={{ height: "75vh" }}
        onSelectEvent={handleSelectEvent}
      />
    </Card>
  );
}
