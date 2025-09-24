from django.urls import path
from .views import (
    health_check,
    register, loginview, forgot_password, reset_password,
    list_courses, enroll_course, update_progress, get_user_courses,
    get_dashboard_analytics, update_study_time,
    submit_assignment, get_user_assignments,
    submit_quiz, create_sample_quizzes,
    mark_notification_read, issue_certificate,
    get_user_settings, get_user_profile, get_user_schedule, get_user_discussions
)

urlpatterns=[
    # Health check
    path('health/',health_check,name='health_check'),

    # Authentication
    path('register/',register,name='register'),
    path('login/',loginview,name='loginview'),
    path('forgot-password/',forgot_password,name='forgot_password'),
    path('reset-password/',reset_password,name='reset_password'),
    
    # Courses
    path('courses/',list_courses,name='list_courses'),
    path('courses/enroll/',enroll_course,name='enroll_course'),
    path('courses/progress/',update_progress,name='update_progress'),
    path('user/courses/',get_user_courses,name='get_user_courses'),
    
    # Dashboard & Analytics
    path('dashboard/analytics/',get_dashboard_analytics,name='get_dashboard_analytics'),
    path('study-time/update/',update_study_time,name='update_study_time'),
    
    # Assignments
    path('assignments/submit/',submit_assignment,name='submit_assignment'),
    path('user/assignments/',get_user_assignments,name='get_user_assignments'),
    
    # Quizzes
    path('quizzes/submit/',submit_quiz,name='submit_quiz'),
    # Backward-compatible alias
    path('submit_quiz/', submit_quiz, name='submit_quiz_legacy'),
    path('quizzes/create-sample/',create_sample_quizzes,name='create_sample_quizzes'),
    
    # Notifications
    path('notifications/read/',mark_notification_read,name='mark_notification_read'),

    # Certificates
    path('certificate/issue/', issue_certificate, name='issue_certificate'),

    # Additional endpoints used by frontend
    path('user/settings/', get_user_settings, name='get_user_settings'),
    path('user/profile/', get_user_profile, name='get_user_profile'),
    path('user/schedule/', get_user_schedule, name='get_user_schedule'),
    path('user/discussions/', get_user_discussions, name='get_user_discussions'),
]
