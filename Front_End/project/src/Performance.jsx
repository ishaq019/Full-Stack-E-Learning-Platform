import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Performance.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Performance = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const username = localStorage.getItem('name') || 'guest';

  useEffect(() => {
    if (username && username !== 'guest') {
      fetchPerformanceData();
    }
  }, [username]);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/dashboard/analytics/?email=${localStorage.getItem('email')}`);
      const data = await response.json();
      if (data.analytics) {
        setPerformanceData(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const pieChartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: performanceData ? [
          performanceData.completed_courses,
          performanceData.in_progress_courses,
          performanceData.total_courses - (performanceData.completed_courses + performanceData.in_progress_courses)
        ] : [0, 0, 0],
        backgroundColor: ['#00b894', '#00cec9', '#ffeaa7'],
        borderColor: ['#019875', '#00a8a3', '#fdcb6e'],
        borderWidth: 2,
      },
    ],
  };

  const lineChartData = {
    labels: performanceData ? performanceData.recent_activity.map(a => a.action) : [],
    datasets: [
      {
        label: 'Course Progress',
        data: performanceData ? performanceData.recent_activity.map(a => a.score || 0) : [],
        borderColor: '#00b894',
        backgroundColor: 'rgba(0, 184, 148, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: '#00b894',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const barChartData = {
    labels: performanceData ? performanceData.recent_activity.map(a => a.action) : [],
    datasets: [
      {
        label: 'Quiz Performance',
        data: performanceData ? performanceData.recent_activity.map(a => a.score || 0) : [],
        backgroundColor: 'rgba(0, 184, 148, 0.7)',
        borderColor: '#00b894',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: '#00b894',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 12,
            weight: 500
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Your Learning Progress',
        color: '#333',
        font: {
          size: 16,
          weight: 600
        },
        padding: 20
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#333',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#333',
          font: {
            size: 12
          }
        }
      }
    },
  };

  return (
    <div className="performance-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>User's E-Learning Platform Performance</h2>
      {username === 'guest' ? (
        <p>Please log in to view your performance metrics.</p>
      ) : !performanceData ? (
        <p>No course data available. Enroll in courses to track your progress.</p>
      ) : (
        <div className="performance-dashboard" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
          <div className="performance-header">
            <div className="performance-summary">
              <div className="summary-item">
                <h3>{performanceData.total_courses}</h3>
                <p>Total Courses</p>
              </div>
              <div className="summary-item">
                <h3>{performanceData.completed_courses}</h3>
                <p>Completed Courses</p>
              </div>
              <div className="summary-item">
                <h3>{performanceData.in_progress_courses}</h3>
                <p>Courses In Progress</p>
              </div>
            </div>
          </div>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Course Completion</h3>
              <Pie data={pieChartData} options={{ ...chartOptions, aspectRatio: 1 }} />
            </div>
            <div className="chart-card">
              <h3>Recent Activity Progress</h3>
              <Line data={lineChartData} options={chartOptions} />
            </div>
            <div className="chart-card">
              <h3>Quiz Performance</h3>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
