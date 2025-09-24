import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  Users,
  Target,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import './DashboardWidgets.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const DashboardWidgets = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    certificates: 0,
    studyTime: 0,
    averageScore: 0
  });

  const [performanceData, setPerformanceData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Hours',
        data: [2, 3, 1, 4, 2, 5, 3],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const email = localStorage.getItem('email') || '';
    if (!email) {
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/dashboard/analytics/?email=${email}`);
      const analytics = response.data.analytics;

      setDashboardData({
        totalCourses: analytics.total_courses || 0,
        completedCourses: analytics.completed_courses || 0,
        inProgressCourses: analytics.in_progress_courses || 0,
        certificates: analytics.completed_courses || 0,
        studyTime: 0, // Will be calculated from study_data
        averageScore: Math.round(analytics.average_progress || 0)
      });

      // Process study data for charts
      if (analytics.study_data && analytics.study_data.length > 0) {
        const recentStudyData = analytics.study_data.slice(-7); // Last 7 days
        const studyHours = recentStudyData.map(day => day.study_time / 60); // Convert to hours
        const days = recentStudyData.map(day => new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }));

        setPerformanceData({
          labels: days,
          datasets: [
            {
              label: 'Study Hours',
              data: studyHours,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
            },
          ],
        });
      }

      // Process recent activity
      if (analytics.recent_activity && analytics.recent_activity.length > 0) {
        setRecentActivity(analytics.recent_activity);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to localStorage data if API fails
      const username = localStorage.getItem('name') || 'guest';
      const enrolledData = localStorage.getItem(`enrolled_${username}`);

      if (enrolledData) {
        const courses = JSON.parse(enrolledData);
        const courseArray = Object.values(courses);

        const completed = courseArray.filter(course => course.status === 'Completed').length;
        const inProgress = courseArray.filter(course => course.status === 'In Progress').length;
        const total = courseArray.length;

        const totalScore = courseArray.reduce((sum, course) => sum + (course.progress || 0), 0);
        const avgScore = total > 0 ? Math.round(totalScore / total) : 0;

        setDashboardData({
          totalCourses: total,
          completedCourses: completed,
          inProgressCourses: inProgress,
          certificates: completed,
          studyTime: Math.floor(Math.random() * 50) + 20,
          averageScore: avgScore
        });
      }
    }
  };

  const statsCards = [
    {
      title: 'Total Courses',
      value: dashboardData.totalCourses,
      icon: BookOpen,
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    {
      title: 'Completed',
      value: dashboardData.completedCourses,
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      title: 'In Progress',
      value: dashboardData.inProgressCourses,
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    {
      title: 'Certificates',
      value: dashboardData.certificates,
      icon: Award,
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    }
  ];

  const progressData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [
          dashboardData.completedCourses,
          dashboardData.inProgressCourses,
          Math.max(0, 10 - dashboardData.totalCourses)
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  };


  const skillsData = {
    labels: ['JavaScript', 'React', 'Python', 'Django', 'AWS'],
    datasets: [
      {
        label: 'Skill Level',
        data: [85, 78, 92, 67, 73],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="dashboard-widgets">
      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                <Icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Progress Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Course Progress</h3>
            <p>Your learning journey</p>
          </div>
          <div className="chart-container">
            <Doughnut data={progressData} options={doughnutOptions} />
          </div>
        </div>

        {/* Performance Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Activity</h3>
            <p>Study hours this week</p>
          </div>
          <div className="chart-container">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>

        {/* Skills Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Skill Levels</h3>
            <p>Your expertise areas</p>
          </div>
          <div className="chart-container">
            <Bar data={skillsData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Recent Activity</h3>
            <p>Latest achievements</p>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? recentActivity.slice(0, 3).map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'quiz' && <Target size={16} />}
                  {activity.type === 'assignment' && <Clock size={16} />}
                  {activity.type === 'completion' && <CheckCircle size={16} />}
                  {activity.type === 'course' && <BookOpen size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.action}</p>
                  <p className="activity-time">{new Date(activity.time).toLocaleString()}</p>
                </div>
              </div>
            )) : (
              <>
                <div className="activity-item">
                  <div className="activity-icon completed">
                    <CheckCircle size={16} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">Complete your first course</p>
                    <p className="activity-time">Start learning!</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon progress">
                    <Clock size={16} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">Begin your learning journey</p>
                    <p className="activity-time">Explore available courses</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">
            <BookOpen size={20} />
            <span>Browse Courses</span>
          </button>
          <button className="action-btn secondary">
            <Target size={20} />
            <span>Take Quiz</span>
          </button>
          <button className="action-btn tertiary">
            <Calendar size={20} />
            <span>View Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
