import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ChartData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'doughnut';
}

const Chart: React.FC<ChartProps> = ({ data, type }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  const commonData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: 'Tâches ajoutées',
        data: data.map(item => item.added),
        borderColor: isDarkMode ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
        backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Tâches terminées',
        data: data.map(item => item.completed),
        borderColor: isDarkMode ? 'rgb(34, 197, 94)' : 'rgb(16, 185, 129)',
        backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: isDarkMode ? '#e2e8f0' : '#1f2937',
          font: {
            size: 12,
            family: "'Inter var', system-ui, sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#e2e8f0' : '#1f2937',
        bodyColor: isDarkMode ? '#e2e8f0' : '#1f2937',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: '600',
          family: "'Inter var', system-ui, sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Inter var', system-ui, sans-serif"
        },
        displayColors: true,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? '#94a3b8' : '#64748b',
          font: {
            size: 12,
            family: "'Inter var', system-ui, sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDarkMode ? '#94a3b8' : '#64748b',
          font: {
            size: 12,
            family: "'Inter var', system-ui, sans-serif"
          },
          stepSize: 1
        }
      }
    }
  };

  const chartStyle = {
    height: '200px',
    width: '100%'
  };

  if (type === 'doughnut') {
    return (
      <div style={chartStyle}>
        <Doughnut
          data={{
            labels: ['Terminées', 'En cours'],
            datasets: [{
              data: [
                data.reduce((acc, item) => acc + item.completed, 0),
                data.reduce((acc, item) => acc + item.added - item.completed, 0)
              ],
              backgroundColor: [
                isDarkMode ? 'rgb(34, 197, 94)' : 'rgb(16, 185, 129)',
                isDarkMode ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)'
              ]
            }]
          }}
          options={commonOptions}
        />
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div style={chartStyle}>
        <Bar
          data={commonData}
          options={{
            ...commonOptions,
            barPercentage: 0.6,
            categoryPercentage: 0.8
          }}
        />
      </div>
    );
  }

  return (
    <div style={chartStyle}>
      <Line data={commonData} options={commonOptions} />
    </div>
  );
};

export default Chart;