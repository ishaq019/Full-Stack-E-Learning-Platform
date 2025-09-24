import React from 'react';
import { 
  Home, 
  BookOpen, 
  Award, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  User,
  Calendar,
  FileText,
  HelpCircle,
  Edit
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, activeSection, setActiveSection }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', key: 'dashboard' },
    { icon: BookOpen, label: 'Courses', key: 'courses' },
    { icon: BarChart3, label: 'Performance', key: 'performance' },
    { icon: Award, label: 'Certifications', key: 'certifications' },
    { icon: FileText, label: 'Assignments', key: 'assignments' },
    { icon: Calendar, label: 'Schedule', key: 'schedule' },
    { icon: MessageSquare, label: 'Discussions', key: 'discussions' },
    { icon: User, label: 'Profile', key: 'profile' },
    { icon: Settings, label: 'Settings', key: 'settings' },
    { icon: HelpCircle, label: 'Help', key: 'help' },
    { icon: Edit, label: 'Take Quiz', key: 'takequiz' }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">Professional</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <li key={index} className="nav-item">
                <button 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.key)}
                  type="button"
                >
                  <Icon className="nav-icon" size={20} />
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <User size={24} />
          </div>
          <div className="user-details">
            <span className="user-name">{localStorage.getItem('name') || 'Guest'}</span>
            <span className="user-role">Student</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
