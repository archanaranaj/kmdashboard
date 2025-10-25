import React from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import MDBox from './MDBox';
import MDTypography from './MDTypography';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ReportsBarChart({ chart }) {
  const { labels, datasets } = chart;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Jobs: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: datasets.label,
        data: datasets.data,
        backgroundColor: [
          'rgba(26, 115, 232, 0.8)',
          'rgba(66, 133, 244, 0.8)',
          'rgba(102, 168, 255, 0.8)',
          'rgba(142, 188, 255, 0.8)',
          'rgba(174, 208, 255, 0.8)',
          'rgba(207, 226, 255, 0.8)',
        ],
        borderColor: [
          'rgb(26, 115, 232)',
          'rgb(66, 133, 244)',
          'rgb(102, 168, 255)',
          'rgb(142, 188, 255)',
          'rgb(174, 208, 255)',
          'rgb(207, 226, 255)',
        ],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  return (
    <MDBox sx={{ height: '300px' }}>
      <Bar options={options} data={data} />
    </MDBox>
  );
}

export default ReportsBarChart;