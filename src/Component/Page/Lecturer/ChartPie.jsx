import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Card, Dropdown, Label, Spinner } from "flowbite-react";
import axios from "axios";
import { useStore } from "react-redux";
import jwt_decode from "jwt-decode";
ChartJS.register(ArcElement, Tooltip, Legend);

export function ChartPie() {
  const [chartData, setChartData] = useState(null);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const userId = decoded.id;
  useEffect(() => {
    axios
      .get(`/user/job/chart-data/${userId}/${currentYear}`)
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId, currentYear]);
  useEffect(() => {
    axios
      .get(`/user/get/academic-year/${userId}`)
      .then((response) => {
        setYears(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  const data = {
    labels: ["Giờ còn thiếu", "Giờ hoàn thành"],
    datasets: [
      {
        label: "# giờ",
        data: chartData
          ? [
              chartData.missHours,
              chartData.totalHours,
            ]
          : [0, 0],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };
  //thay đổi năm
  const handelChangeYaer = (a) =>{
    setCurrentYear(a)
  }
  return chartData === null ? (
    <Spinner color="failure" />
  ) : (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Biểu đồ tỉ lệ giờ hoạt động</Label>
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
      <div className="flex justify-center items-center">
        <div
          className="flex flex-wrap"
          style={{ width: "500px", height: "375px" }}
        >
          <Pie data={data} className="ml-6" />
        </div>
      </div>
    </Card>
  );
}
