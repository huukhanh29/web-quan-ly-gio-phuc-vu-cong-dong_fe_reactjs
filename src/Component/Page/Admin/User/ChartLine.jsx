import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Card, Dropdown, Spinner } from "flowbite-react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../store/authSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ tỉ lệ chat",
      font: {
        size: 20,
      },
    },
  },
};

export function ChartLine() {
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState(null);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  useEffect(() => {
    document.title = "Trang chủ";
    axios
      .get(`/user/chat/years`)
      .then((response) => {
        setYears(response.data);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          dispatch(setToken(""));
        }
      });
  }, [dispatch]);
  useEffect(() => {
    axios
      .get("/user/chart", { params: { year: currentYear }})
      .then((response) => response.data)
      .then((data) => {
        const labels = data.labels;
        const values = data.data;
        setChartData({
          labels,
          datasets: [
            {
              label: "Số lượt hỏi",
              data: values,
              fill: false,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
      });
  }, [currentYear]);
  const handelChangeYaer = (a) =>{
    setCurrentYear(a)
  }
  return chartData === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex">
        <div
          className="flex flex-wrap"
        >
          <Dropdown
          label={currentYear}
          style={{ height: "21px", width: "150px" }}
          color="greenToBlue"
        >
          {years.map((year) => (
            <Dropdown.Item key={year} value={year} onClick={() => handelChangeYaer(year)}>
              {year}
            </Dropdown.Item>
          ))}
        </Dropdown>
        </div>
      </div>

          <Line options={options} data={chartData} width={80} height={30} />
    </Card>
  );
}