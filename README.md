# Full-Stack E‑Learning Platform

## Project Overview
The Full‑Stack E‑Learning Platform is a comprehensive system that delivers interactive online courses and learning tools. It combines a modern front‑end built with **React** (using Vite for fast development) and a powerful **Django** back‑end. The platform allows students to register, enroll in courses, complete assignments and quizzes, track progress, and earn certificates.

## Key Features

- **User Authentication & Profiles** – Students can register, log in, reset their passwords and update personal settings. Each user has a profile with a bio, profile picture, and join date.
- **Course Management** – Courses contain titles, descriptions, durations, categories and difficulty levels. Students can browse available courses, view details and enroll.
- **Enrollments & Progress Tracking** – Enrollment records capture a student’s status (`Enrolled`, `In Progress` or `Completed`), progress percentage, quiz scores, enrolment/last‑update dates and whether a certificate has been issued.
- **Assignments & Submissions** – Courses can include assignments with instructions, due dates and maximum scores. Students submit assignments via text or file uploads, and receive scores and feedback.
- **Quizzes** – In‑course quizzes include multiple questions, a time limit, maximum attempts and a passing score. Students can attempt quizzes and view their results; quiz data (questions, answers and scores) is stored as JSON for flexibility.
- **Certificates** – Upon completing a course, students can receive a certificate with a unique ID, issue date and verification link.
- **Notifications** – Students receive notifications about assignments, quizzes, course updates or general announcements. Each notification records whether it has been read and includes a related link.
- **Dashboard & Analytics** – A personalized dashboard displays study time, courses accessed, quizzes completed and assignments submitted. Recent activity logs show the latest quiz attempts, assignment submissions and course completions.
- **User Settings, Schedule & Discussions** – Endpoints allow users to manage settings, view schedules and participate in course discussions.
- **RESTful API** – The back‑end exposes a clean API for all features, enabling the front‑end (or other clients) to consume data efficiently.
- **Tech Stack** – The back‑end uses **Django** with **Django REST Framework** and **SQLite** for storage, while the front‑end uses **React** with **Vite** for a responsive single‑page application.

## Architecture

This project follows a classic client–server architecture:

- **Front‑End (React + Vite)** – The `Front_End/project` directory contains a React application scaffolded with Vite. The app fetches data from the back‑end via HTTP and renders pages for authentication, course browsing, assignments, quizzes and dashboard analytics.
- **Back‑End (Django)** – Located in the `Back_End` directory, the Django project defines models such as `Student`, `Course`, `Enrollment`, `Assignment`, `AssignmentSubmission`, `Quiz`, `QuizAttempt`, `Certificate`, `Notification` and `DashboardAnalytics`. It provides RESTful endpoints for registration, login, password recovery, course listing and enrollment, assignment and quiz handling, analytics, certificates, notifications and user settings.
- **Database** – An SQLite database (e.g., `db.sqlite3`) stores all persistent data. Django’s ORM abstracts database operations for convenience.
- **Data Flow** – The front‑end triggers API calls (e.g., to `/register/`, `/login/`, `/courses/`, `/assignments/submit/`, `/quizzes/submit/`). The back‑end validates requests, performs business logic, reads or writes data via the ORM, and returns JSON responses. The front‑end updates UI state accordingly.

## Getting Started

### Prerequisites

- **Back‑End**: Python 3.10+ and pip.
- **Front‑End**: Node.js (v16 or higher) and npm (or yarn).
- Optionally, [Virtualenv](https://virtualenv.pypa.io/) for Python dependency isolation.

### Back‑End Setup

```bash
cd Back_End
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
# Apply database migrations
python manage.py migrate
# Run the development server
python manage.py runserver
```

### Front‑End Setup

```bash
cd Front_End/project
npm install    # or yarn install
npm run dev    # Starts the Vite development server
```

Navigate to `http://localhost:5173` (default Vite port) to access the front‑end and ensure the back‑end server is running on `http://localhost:8000`.

### API Endpoints

The Django back‑end exposes numerous endpoints. A few examples include:

| Endpoint | Method | Description |
|---|---|---|
| `/health/` | GET | Health‑check for API availability |
| `/register/` | POST | Create a new student account |
| `/login/` | POST | Authenticate a user |
| `/forgot-password/` | POST | Initiate a password‑reset email |
| `/reset-password/` | POST | Reset a password using a token |
| `/courses/` | GET | List all available courses |
| `/courses/enroll/` | POST | Enroll a student in a course |
| `/courses/progress/` | POST | Update course progress |
| `/user/courses/` | GET | List a student's enrolled courses |
| `/assignments/submit/` | POST | Submit an assignment |
| `/user/assignments/` | GET | Get assignments for the logged‑in student |
| `/quizzes/submit/` | POST | Submit a quiz attempt |
| `/dashboard/analytics/` | GET | Retrieve dashboard analytics |
| `/study-time/update/` | POST | Update study time |
| `/certificate/issue/` | POST | Issue a certificate upon completion |
| `/notifications/read/` | POST | Mark notifications as read |
| `/user/settings/` | GET | Fetch or update user settings |

For a full list, see `Back_End/project/app/urls.py`.

## Directory Structure

```
Full-Stack-E-Learning-Platform/
├── Back_End/
│   ├── manage.py               # Django entry point
│   ├── requirements.txt        # Backend dependencies (Django, DRF, etc.)
│   ├── db.sqlite3              # SQLite database (development)
│   └── project/
│       ├── app/                # Main application
│       │   ├── models.py       # Database models (students, courses, etc.)
│       │   ├── views.py        # API view functions
│       │   ├── urls.py         # API routing
│       │   └── ...             # Other modules
│       └── project/            # Django project configuration
│           ├── settings.py     # Project settings
│           ├── urls.py         # Root URL configuration
│           └── ...
└── Front_End/
    └── project/
        ├── src/                # React source code
        ├── public/             # Static assets
        ├── package.json        # Front‑end dependencies
        └── README.md           # Vite/React boilerplate details
```

## Contributing

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add some feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request describing your changes.

## License

This project is open‑sourced. Feel free to inspect, modify and distribute according to the terms specified in an accompanying `LICENSE` file (to be added).
