import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Card, Label } from "flowbite-react";
import axios from "axios";
import { useStore } from "react-redux";
import jwt_decode from "jwt-decode";
ChartJS.register(ArcElement, Tooltip, Legend);

export function ChartPie() {
  const [chartData, setChartData] = useState(null);
  const { token } = useStore().getState().auth;
  const decoded = jwt_decode(token);
  const userId = decoded.id;
  useEffect(() => {
    axios
      .get(`/user/job/chart-data/${userId}`)
      .then((response) => {
        setChartData(response.data);
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
              chartData.requiredHours - chartData.totalHours,
              chartData.totalHours,
            ]
          : [0, 0],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Card>
      <div className="flex justify-between items-center">
        <Label className="text-xl">Biểu đồ tỉ lệ giờ hoạt động</Label>
      </div>
      <div className="flex justify-center items-center">
        <div
          className="flex flex-wrap"
          style={{ width: "500px", height: "410px" }}
        >
          <Pie data={data} className="ml-6" />
        </div>
      </div>
    </Card>
  );
}
