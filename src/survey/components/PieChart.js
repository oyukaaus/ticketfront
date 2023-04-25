import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

const CustomPieChart = (props) => {
  const data = {
    labels: props?.data?.map((d) => d.label),
    datasets: [
      {
        data: props?.data?.map((d) => d.value),
        backgroundColor: props?.data?.map((d) => d.color),
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return <Pie data={data} options={options} />;
};

export default CustomPieChart;
