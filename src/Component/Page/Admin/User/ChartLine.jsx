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
import { Card, Dropdown, Label, Spinner } from "flowbite-react";
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
      text: "Chart.js Line Chart",
    },
  },
};

export function ChartLine() {
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState(null);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  useEffect(() => {
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
        console.log(data);
        const labels = data.labels;
        const values = data.data;
        setChartData({
          labels,
          datasets: [
            {
              label: "Dataset 1",
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
      <div className="flex justify-between items-center">
        <Label className="text-xl">Biểu đồ tỉ lệ chat</Label>
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
      <div className="flex">
        <div
          className="flex flex-wrap"
        >
          <Label>Chỉ tiêu: {chartData.requiredHours} giờ</Label>
          {chartData.requiredHours -chartData.totalHours <0 &&(
            <Label className="ml-5">Vượt chỉ tiêu: {chartData.totalHours-chartData.requiredHours} giờ</Label>
          )}
          {chartData.missHours !== 0 &&(
            <Label className="ml-5">Còn thiếu: {chartData.missHours} giờ</Label>
          )}
        </div>
      </div>

          <Line options={options} data={chartData} width={80} height={35} />
    </Card>
  );
}