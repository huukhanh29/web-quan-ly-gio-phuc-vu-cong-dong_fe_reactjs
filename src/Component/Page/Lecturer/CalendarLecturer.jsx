import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Label } from "flowbite-react";
import { useDispatch, useStore } from "react-redux";
import axios from "axios";
import { setToken } from "../../../store/authSlice";
import jwt_decode from "jwt-decode";

const localizer = momentLocalizer(moment);

export default function CalendarLecturer() {
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const id = decoded.id;
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/activities/get/of/${id}`);
      const activity = data.filter(
        (item) =>
          item.status === "Chờ xác nhận" || item.status === "Đã xác nhận"
      );
      setEvents(
        activity.map((activity) => ({
          start: activity.startTime,
          end: activity.endTime,
          title: activity.name,
        }))
      );
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    document.title = "Danh sách câu hỏi";
    fetchData();
  }, [fetchData]);

  return (
    <Card>
      <Label className="text-xl">Lịch trình hoạt động</Label>
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        views={{ month: true, agenda: true }}
        events={events}
        style={{ height: "75vh" }}
      />
    </Card>
  );
}
