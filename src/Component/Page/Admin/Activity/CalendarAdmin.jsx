import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Label } from "flowbite-react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setToken } from "../../../../store/authSlice";

const localizer = momentLocalizer(moment);

export default function CalendarAdmin() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get("/activities/get/all");
      setEvents(
        data.content.map((activity) => ({
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
  }, [dispatch]);

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
        views={{ month: true, agenda:true }}
        events={events}
        style={{ height: "70vh" }}
      />
    </Card>
  );
}
