from django.db import models
from typing import Any, Dict, List
import uuid

class Student(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    reset_token = models.UUIDField(null=True, blank=True)
    reset_token_expiry = models.DateTimeField(null=True, blank=True)
    profile_picture = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username

class Course(models.Model):
    id = models.CharField(max_length=50, primary_key=True)  # e.g. 'webdev', 'reactjs'
    title = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.CharField(max_length=20)
    icon = models.CharField(max_length=10)
    difficulty_level = models.CharField(max_length=20, default='Beginner')  # Beginner, Intermediate, Advanced
    category = models.CharField(max_length=50, default='Programming')
    prerequisites = models.TextField(blank=True, null=True)
    learning_outcomes: models.JSONField[List[str]] = models.JSONField(default=list)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, default='Enrolled')  # 'Enrolled', 'In Progress', 'Completed'
    progress = models.IntegerField(default=0)
    enrolled_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    quiz_scores: models.JSONField[List[Dict[str, Any]]] = models.JSONField(default=list)
    completion_date = models.DateTimeField(null=True, blank=True)
    certificate_issued = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"

class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructions = models.TextField()
    due_date = models.DateTimeField()
    max_score = models.IntegerField(default=100)
    created_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='submissions')
    submission_text = models.TextField()
    file_url = models.URLField(blank=True, null=True)
    submitted_date = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)
    graded_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('assignment', 'student')

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"

class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=200)
    description = models.TextField()
    questions: models.JSONField[List[Dict[str, Any]]] = models.JSONField(default=list)  # Store quiz questions as JSON
    time_limit = models.IntegerField(default=30)  # in minutes
    max_attempts = models.IntegerField(default=3)
    passing_score = models.IntegerField(default=70)
    created_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='quiz_attempts')
    answers: models.JSONField[Dict[str, Any]] = models.JSONField(default=dict)  # Store student answers
    score = models.IntegerField()
    completed_date = models.DateTimeField(auto_now_add=True)
    time_taken = models.IntegerField()  # in minutes

    def __str__(self):
        return f"{self.student.username} - {self.quiz.title} - {self.score}%"

class Certificate(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    certificate_id = models.UUIDField(default=uuid.uuid4, unique=True)
    issued_date = models.DateTimeField(auto_now_add=True)
    verification_url = models.URLField(blank=True, null=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"Certificate - {self.student.username} - {self.course.title}"

class Notification(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50)  # 'assignment', 'quiz', 'course', 'general'
    is_read = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    related_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.student.username} - {self.title}"

class DashboardAnalytics(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='analytics')
    date = models.DateField()
    study_time = models.IntegerField(default=0)  # in minutes
    courses_accessed = models.IntegerField(default=0)
    quizzes_completed = models.IntegerField(default=0)
    assignments_submitted = models.IntegerField(default=0)

    class Meta:
        unique_together = ('student', 'date')

    def __str__(self):
        return f"{self.student.username} - {self.date}"
