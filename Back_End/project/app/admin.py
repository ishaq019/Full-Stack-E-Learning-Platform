from django.contrib import admin
from .models import (
    Student, Course, Enrollment, Assignment, AssignmentSubmission, 
    Quiz, QuizAttempt, Certificate, Notification, DashboardAnalytics
)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin[Student]):
    list_display = ('username', 'email', 'date_joined', 'last_login')
    list_filter = ('date_joined', 'last_login')
    search_fields = ('username', 'email')
    readonly_fields = ('date_joined',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin[Course]):
    list_filter = ('difficulty_level', 'category', 'created_date')
    search_fields = ('title', 'description')
    readonly_fields = ('created_date', 'updated_date')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin[Enrollment]):
    list_filter = ('status', 'enrolled_date', 'certificate_issued')
    search_fields = ('student__username', 'course__title')
    readonly_fields = ('enrolled_date', 'last_updated')

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin[Assignment]):
    list_filter = ('course', 'is_active', 'created_date', 'due_date')
    search_fields = ('title', 'description')
    readonly_fields = ('created_date',)

@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin[AssignmentSubmission]):
    list_filter = ('submitted_date', 'score')
    search_fields = ('student__username', 'assignment__title')
    readonly_fields = ('submitted_date', 'graded_date')

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin[Quiz]):
    list_filter = ('course', 'is_active', 'created_date')
    search_fields = ('title', 'description')
    readonly_fields = ('created_date',)

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin[QuizAttempt]):
    list_filter = ('completed_date', 'score')
    search_fields = ('student__username', 'quiz__title')
    readonly_fields = ('completed_date',)

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin[Certificate]):
    list_filter = ('issued_date',)
    search_fields = ('student__username', 'course__title', 'certificate_id')
    readonly_fields = ('certificate_id', 'issued_date')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin[Notification]):
    list_filter = ('notification_type', 'is_read', 'created_date')
    search_fields = ('student__username', 'title', 'message')
    readonly_fields = ('created_date',)

@admin.register(DashboardAnalytics)
class DashboardAnalyticsAdmin(admin.ModelAdmin[DashboardAnalytics]):
    list_display = ('student', 'date', 'study_time', 'courses_accessed', 'quizzes_completed')
    list_filter = ('date',)
    search_fields = ('student__username',)
    readonly_fields = ('date',)
