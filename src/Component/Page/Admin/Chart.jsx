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
import { Spinner } from "flowbite-react";

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

export function Chart() {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    axios
      .get("/user/chart")
      .then((response) => response.data)
      .then((data) => {
        //console.log(data);
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
  }, []);
  return chartData === null ? (
    <Spinner color="failure" />
  ) : (
    <Line options={options} data={chartData} />
  );
}