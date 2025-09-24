import json
from typing import Any, Dict, List, cast
from .models import (
    Student, Course, Enrollment, Assignment, AssignmentSubmission, 
    Quiz, QuizAttempt, Certificate, Notification, DashboardAnalytics
)
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db.models import Avg
from datetime import timedelta
import uuid

@csrf_exempt
def health_check(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        return JsonResponse({
            "status": "ok",
            "time": timezone.now().isoformat()
        }, status=200)
    return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def register(request: HttpRequest) -> JsonResponse:
    if request.method=="POST":
        try:
            data=json.loads(request.body)
            username=data.get("username")
            password=data.get("password")
            email=data.get("email")
            if not username or not email or not password:
                return JsonResponse({"err":"Fill the details "})
            if Student.objects.filter(email=email).exists():
                return JsonResponse({"err":"Email already exists"},status=400)
            else:
                # Create the user
                Student.objects.create(username=username,email=email,password=make_password(password))
                
                # Send welcome email
                try:
                    send_mail(
                        'Welcome to Our Platform!',
                        f'Hi {username},\n\nThank you for registering with us! Your account has been successfully created.\n\nBest regards,\nThe Team',
                        settings.EMAIL_HOST_USER,
                        [email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Error sending email: {str(e)}")
                    # Even if email fails, registration was successful
                    pass
                
                return JsonResponse({"msg":"Registration Successful"},status=200)
        except Exception as e:
            return JsonResponse({"err":str(e)},status=500)
    else:
        return JsonResponse({"err":"Invalid Method"},status=400)

@csrf_exempt
def loginview(request: HttpRequest) -> JsonResponse:
    if request.method=='POST':
        try:
            data=json.loads(request.body.decode('utf-8'))
            email=data.get('email')
            password=data.get('password')
            if not email or not password:
                return JsonResponse({"err":"Fill the details"},status=400)
            try:
                user=Student.objects.get(email=email)
            except Student.DoesNotExist:
                return JsonResponse({"err":"User Does Not Exist"},status=404)
            if check_password(password,user.password):
                return JsonResponse({"succ":"Login Successful","name":user.username,"email":user.email},status=200)
            else:
                return JsonResponse({"err":"Invalid Password"},status=401)
        except Exception as e:
            return JsonResponse({"err":f"Server error:{str(e)}"},status=500)
    else:
        return JsonResponse({"err":"Invalid Method"},status=405)

@csrf_exempt
def forgot_password(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({"err": "Email is required"}, status=400)
            try:
                user = Student.objects.get(email=email)
            except Student.DoesNotExist:
                return JsonResponse({"err": "User does not exist"}, status=404)
            
            # Generate reset token and expiry (valid for 1 hour)
            token = uuid.uuid4()
            user.reset_token = token
            user.reset_token_expiry = timezone.now() + timedelta(hours=1)
            user.save()
            
            reset_link = f"http://localhost:5174/react/reset-password?token={token}"
            
            # Send reset email
            try:
                send_mail(
                    'Password Reset Request',
                    f'Hi {user.username},\n\nPlease use the following link to reset your password. This link is valid for 1 hour.\n\n{reset_link}\n\nIf you did not request this, please ignore this email.',
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )
                return JsonResponse({"msg": "Password reset email sent"}, status=200)
            except Exception as e:
                return JsonResponse({"err": f"Failed to send email: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def reset_password(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')
            new_password = data.get('new_password')
            if not token or not new_password:
                return JsonResponse({"err": "Token and new password are required"}, status=400)
            try:
                user = Student.objects.get(reset_token=token)
            except Student.DoesNotExist:
                return JsonResponse({"err": "Invalid token"}, status=400)
            if user.reset_token_expiry and user.reset_token_expiry < timezone.now():
                return JsonResponse({"err": "Token expired"}, status=400)
            user.password = make_password(new_password)
            user.reset_token = None
            user.reset_token_expiry = None
            user.save()
            return JsonResponse({"msg": "Password reset successful"}, status=200)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def list_courses(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        try:
            courses = Course.objects.all()
            course_list: List[Dict[str, Any]] = []
            for course in courses:
                course_list.append({
                    "id": course.id,
                    "title": course.title,
                    "description": course.description,
                    "duration": course.duration,
                    "icon": course.icon
                })
            return JsonResponse({"courses": course_list}, status=200)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def enroll_course(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            course_id = data.get('course_id')
            if not email or not course_id:
                return JsonResponse({"err": "Email and course_id are required"}, status=400)
            try:
                user = Student.objects.get(email=email)
                course = Course.objects.get(id=course_id)
            except Student.DoesNotExist:
                return JsonResponse({"err": "User does not exist"}, status=404)
            except Course.DoesNotExist:
                return JsonResponse({"err": "Course does not exist"}, status=404)
            _enrollment, created = Enrollment.objects.get_or_create(student=user, course=course)
            if not created:
                return JsonResponse({"msg": "Already enrolled"}, status=200)
            return JsonResponse({"msg": "Enrolled successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def update_progress(request: HttpRequest) -> JsonResponse:
    if request.method in ['PUT', 'POST']:
        try:
            data = json.loads(request.body)
            email = data.get('email')
            course_id = data.get('course_id')
            progress = data.get('progress')
            if not email or not course_id or progress is None:
                return JsonResponse({"err": "Email, course_id and progress are required"}, status=400)
            try:
                user = Student.objects.get(email=email)
                course = Course.objects.get(id=course_id)
                enrollment = Enrollment.objects.get(student=user, course=course)
            except (Student.DoesNotExist, Course.DoesNotExist, Enrollment.DoesNotExist):
                return JsonResponse({"err": "User, course or enrollment does not exist"}, status=404)
            enrollment.progress = progress
            if progress == 100:
                enrollment.status = 'Completed'
                enrollment.completion_date = timezone.now()
            else:
                enrollment.status = 'In Progress'
                enrollment.completion_date = None
            enrollment.last_updated = timezone.now()
            enrollment.save()
            return JsonResponse({"msg": "Progress updated"}, status=200)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def get_user_courses(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({"err": "Email is required"}, status=400)
        try:
            user = Student.objects.get(email=email)
            enrollments = Enrollment.objects.filter(student=user)
            courses_data: List[Dict[str, Any]] = []
            for enrollment in enrollments:
                quiz_scores_value: Any = getattr(enrollment, 'quiz_scores', None)
                quiz_scores_list: List[Dict[str, Any]] = cast(
                    List[Dict[str, Any]],
                    quiz_scores_value if isinstance(quiz_scores_value, list) else []
                )
                courses_data.append({
                    "course_id": enrollment.course.id,
                    "title": enrollment.course.title,
                    "status": enrollment.status,
                    "progress": enrollment.progress,
                    "enrolled_date": enrollment.enrolled_date,
                    "last_updated": enrollment.last_updated,
                    "quiz_scores": quiz_scores_list,
                    "certificate_issued": enrollment.certificate_issued,
                    "completion_date": enrollment.completion_date
                })
            return JsonResponse({"courses": courses_data}, status=200)
        except Student.DoesNotExist:
            return JsonResponse({"err": "User does not exist"}, status=404)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def get_dashboard_analytics(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({"err": "Email is required"}, status=400)
        try:
            user = Student.objects.get(email=email)
            
            # Get enrollments
            enrollments = Enrollment.objects.filter(student=user)
            total_courses = enrollments.count()
            completed_courses = enrollments.filter(status='Completed').count()
            in_progress_courses = enrollments.filter(status='In Progress').count()
            
            # Calculate average progress
            avg_progress = enrollments.aggregate(Avg('progress'))['progress__avg'] or 0
            
            # Get recent activity
            recent_activity: List[Dict[str, Any]] = []
            
            # Quiz attempts
            quiz_attempts = QuizAttempt.objects.filter(
                student=user
            ).order_by('-completed_date')[:5]
            for attempt in quiz_attempts:
                recent_activity.append({
                    'type': 'quiz',
                    'action': f"Completed quiz in {attempt.quiz.course.title}",
                    'time': attempt.completed_date,
                    'score': attempt.score
                })
            
            # Assignment submissions
            submissions = AssignmentSubmission.objects.filter(
                student=user
            ).order_by('-submitted_date')[:5]
            for submission in submissions:
                recent_activity.append({
                    'type': 'assignment',
                    'action': f"Submitted assignment for {submission.assignment.course.title}",
                    'time': submission.submitted_date,
                    'score': submission.score
                })
            
            # Course completions
            completions = enrollments.filter(
                status='Completed'
            ).order_by('-completion_date')[:5]
            for completion in completions:
                if completion.completion_date:  # Add null check
                    recent_activity.append({
                        'type': 'completion',
                        'action': f"Completed {completion.course.title}",
                        'time': completion.completion_date
                    })
            
            # Sort all activity by time (filter out None values)
            recent_activity = [activity for activity in recent_activity if activity.get('time')]
            recent_activity.sort(key=lambda x: x['time'], reverse=True)
            recent_activity = recent_activity[:5]  # Get 5 most recent activities
            
            # Get study time analytics
            today = timezone.now().date()
            week_ago = today - timedelta(days=7)
            study_analytics = DashboardAnalytics.objects.filter(
                student=user,
                date__gte=week_ago
            ).order_by('date')
            
            study_data: List[Dict[str, Any]] = []
            for analytics in study_analytics:
                study_data.append({
                    'date': analytics.date,
                    'study_time': analytics.study_time,
                    'courses_accessed': analytics.courses_accessed,
                    'quizzes_completed': analytics.quizzes_completed,
                    'assignments_submitted': analytics.assignments_submitted
                })
            
            # Get unread notifications
            notifications = Notification.objects.filter(
                student=user,
                is_read=False
            ).order_by('-created_date')[:5]
            
            notification_data: List[Dict[str, Any]] = []
            for notification in notifications:
                notification_data.append({
                    'title': notification.title,
                    'message': notification.message,
                    'type': notification.notification_type,
                    'created_date': notification.created_date,
                    'related_url': notification.related_url
                })
            
            return JsonResponse({
                "analytics": {
                    "total_courses": total_courses,
                    "completed_courses": completed_courses,
                    "in_progress_courses": in_progress_courses,
                    "average_progress": round(avg_progress, 2),
                    "recent_activity": recent_activity,
                    "study_data": study_data,
                    "notifications": notification_data
                }
            }, status=200)
            
        except Student.DoesNotExist:
            return JsonResponse({"err": "User does not exist"}, status=404)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def submit_assignment(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            assignment_id = data.get('assignment_id')
            submission_text = data.get('submission_text')
            file_url = data.get('file_url')
            
            if not all([email, assignment_id, submission_text]):
                return JsonResponse({"err": "Email, assignment_id and submission_text are required"}, status=400)
            
            try:
                user = Student.objects.get(email=email)
                assignment = Assignment.objects.get(id=assignment_id)
            except Student.DoesNotExist:
                return JsonResponse({"err": "User does not exist"}, status=404)
            except Assignment.DoesNotExist:
                return JsonResponse({"err": "Assignment does not exist"}, status=404)
            
            submission, created = AssignmentSubmission.objects.get_or_create(
                student=user,
                assignment=assignment,
                defaults={
                    'submission_text': submission_text,
                    'file_url': file_url
                }
            )
            
            if not created:
                submission.submission_text = submission_text
                submission.file_url = file_url
                submission.submitted_date = timezone.now()
                submission.save()
            
            # Create notification
            Notification.objects.create(
                student=user,
                title='Assignment Submitted',
                message=f'Your submission for {assignment.title} has been received.',
                notification_type='assignment'
            )
            
            return JsonResponse({"msg": "Assignment submitted successfully"}, status=200)
            
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def get_user_assignments(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({"err": "Email is required"}, status=400)
        try:
            user = Student.objects.get(email=email)
            assignments = Assignment.objects.all()
            submissions = AssignmentSubmission.objects.filter(student=user)
            submission_dict: Dict[Any, AssignmentSubmission] = {}
            for sub in submissions:
                aid = getattr(sub.assignment, 'id', None)
                if aid is not None:
                    submission_dict[aid] = sub
            
            courses: Dict[str, Dict[str, Any]] = {}
            for assignment in assignments:
                cid_any = getattr(assignment.course, 'id', '')
                course_id = str(cid_any)
                if course_id not in courses:
                    courses[course_id] = {
                        "course_id": course_id,
                        "course_title": getattr(assignment.course, 'title', ''),
                        "assignments": []
                    }
                assignment_id = getattr(assignment, 'id', None)
                submission = submission_dict.get(assignment_id)
                status = "Not Submitted"
                if submission:
                    status = "Submitted"
                courses[course_id]["assignments"].append({
                    "assignment_id": assignment_id,
                    "title": getattr(assignment, 'title', ''),
                    "description": getattr(assignment, 'description', ''),
                    "due_date": assignment.due_date.strftime("%Y-%m-%d") if assignment.due_date else None,
                    "status": status
                })
            return JsonResponse({"courses": list(courses.values())}, status=200)
        except Student.DoesNotExist:
            return JsonResponse({"err": "User does not exist"}, status=404)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def submit_quiz(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            quiz_id = data.get('quiz_id')
            answers = data.get('answers')
            time_taken = data.get('time_taken')
            
            if not all([email, quiz_id, answers, time_taken]):
                return JsonResponse({"err": "Email, quiz_id, answers and time_taken are required"}, status=400)
            
            try:
                user = Student.objects.get(email=email)
                quiz = Quiz.objects.get(id=quiz_id)
            except Student.DoesNotExist:
                return JsonResponse({"err": "User does not exist"}, status=404)
            except Quiz.DoesNotExist:
                return JsonResponse({"err": "Quiz does not exist"}, status=404)
            
            # Calculate score
            correct_answers = 0
            questions_value: Any = getattr(quiz, 'questions', None)
            questions: List[Dict[str, Any]] = cast(
                List[Dict[str, Any]],
                questions_value if isinstance(questions_value, list) else []
            )
            total_questions = len(questions)
            
            for question_id, answer in answers.items():
                question = next((q for q in questions if str(q.get('id')) == str(question_id)), None)
                if question and question.get('correct_answer') == answer:
                    correct_answers += 1
            
            score_int = int(round((correct_answers / total_questions) * 100))
            
            # Create quiz attempt
            attempt = QuizAttempt.objects.create(
                student=user,
                quiz=quiz,
                answers=answers,
                score=score_int,
                time_taken=time_taken
            )
            
            # Update enrollment progress if needed
            enrollment = Enrollment.objects.get(student=user, course=quiz.course)
            svalue: Any = getattr(enrollment, 'quiz_scores', None)
            scores: List[Dict[str, Any]] = cast(
                List[Dict[str, Any]],
                svalue if isinstance(svalue, list) else []
            )
            scores.append({
                'quiz_id': quiz_id,
                'score': score_int,
                'attempt_id': getattr(attempt, 'id', None),
                'date': timezone.now().isoformat()
            })
            enrollment.quiz_scores = scores
            # Update progress and status based on score
            # For example, if score >= passing_score, mark progress 100% and status Completed
            if score_int >= quiz.passing_score:
                enrollment.progress = 100
                enrollment.status = 'Completed'
                enrollment.completion_date = timezone.now()
            else:
                # Optionally update progress partially or keep as is
                enrollment.progress = max(enrollment.progress, score_int)
                enrollment.status = 'In Progress'
                enrollment.completion_date = None
            enrollment.save()
            
            # Create notification
            Notification.objects.create(
                student=user,
                title='Quiz Completed',
                message=f'You scored {score_int}% on {quiz.title}',
                notification_type='quiz'
            )
            
            return JsonResponse({
                "msg": "Quiz submitted successfully",
                "score": score_int,
                "passing_score": quiz.passing_score,
                "passed": score_int >= quiz.passing_score
            }, status=200)
            
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def create_sample_quizzes(request: HttpRequest) -> JsonResponse:
    if request.method not in ['POST', 'GET']:
        return JsonResponse({"err": "Invalid Method"}, status=405)
    try:
        created = 0
        for course in Course.objects.all():
            if not Quiz.objects.filter(course=course, title__iexact="Sample Quiz").exists():
                questions: List[Dict[str, Any]] = [
                    {"id": 1, "question": "What is 2 + 2?", "options": ["3", "4", "5"], "correct_answer": "4"},
                    {"id": 2, "question": "Select the primary language of Django.", "options": ["Java", "Python", "Ruby"], "correct_answer": "Python"}
                ]
                Quiz.objects.create(
                    course=course,
                    title="Sample Quiz",
                    description="Auto-generated sample quiz",
                    questions=questions,
                    time_limit=10,
                    max_attempts=3,
                    passing_score=60,
                    is_active=True
                )
                created += 1
        return JsonResponse({"msg": "Sample quizzes ensured", "created": created}, status=200)
    except Exception as e:
        return JsonResponse({"err": str(e)}, status=500)

@csrf_exempt
def get_user_settings(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({"err": "Email is required"}, status=400)
        try:
            user = Student.objects.get(email=email)
            return JsonResponse({
                "email": user.email,
                "username": user.username,
                "notifications": {
                    "email_notifications": True,
                    "newsletter": False
                }
            }, status=200)
        except Student.DoesNotExist:
            return JsonResponse({"err": "User does not exist"}, status=404)
    return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def get_user_profile(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({"err": "Email is required"}, status=400)
        try:
            user = Student.objects.get(email=email)
            enrollment_qs = Enrollment.objects.filter(student=user)
            return JsonResponse({
                "username": user.username,
                "email": user.email,
                "bio": user.bio,
                "profile_picture": user.profile_picture,
                "date_joined": user.date_joined,
                "enrolled_courses": enrollment_qs.count(),
                "completed_courses": enrollment_qs.filter(status='Completed').count()
            }, status=200)
        except Student.DoesNotExist:
            return JsonResponse({"err": "User does not exist"}, status=404)
    return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def get_user_schedule(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({"err": "Email is required"}, status=400)
        try:
            user = Student.objects.get(email=email)
            now = timezone.now()
            enrolled_course_ids = list(Enrollment.objects.filter(student=user).values_list('course_id', flat=True))
            upcoming_assignments = Assignment.objects.filter(course__id__in=enrolled_course_ids, due_date__gte=now).order_by('due_date')[:10]
            data: List[Dict[str, Any]] = []
            for a in upcoming_assignments:
                data.append({
                    "type": "assignment",
                    "course": a.course.title,
                    "title": a.title,
                    "due_date": a.due_date
                })
            upcoming_quizzes = Quiz.objects.filter(course__id__in=enrolled_course_ids, is_active=True).order_by('-created_date')[:10]
            for q in upcoming_quizzes:
                data.append({
                    "type": "quiz",
                    "course": q.course.title,
                    "title": q.title,
                    "created_date": q.created_date
                })
            return JsonResponse({"schedule": data}, status=200)
        except Student.DoesNotExist:
            return JsonResponse({"err": "User does not exist"}, status=404)
    return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def get_user_discussions(request: HttpRequest) -> JsonResponse:
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({"err": "Email is required"}, status=400)
        # Placeholder: no discussions feature yet
        return JsonResponse({"discussions": []}, status=200)
    return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def mark_notification_read(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            notification_id = data.get('notification_id')
            
            if not notification_id:
                return JsonResponse({"err": "Notification ID is required"}, status=400)
            
            try:
                notification = Notification.objects.get(id=notification_id)
                notification.is_read = True
                notification.save()
                return JsonResponse({"msg": "Notification marked as read"}, status=200)
            except Notification.DoesNotExist:
                return JsonResponse({"err": "Notification does not exist"}, status=404)
            
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def update_study_time(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            study_time = data.get('study_time')  # in minutes
            courses_accessed = data.get('courses_accessed', 0)
            quizzes_completed = data.get('quizzes_completed', 0)
            assignments_submitted = data.get('assignments_submitted', 0)
            
            if not all([email, study_time]):
                return JsonResponse({"err": "Email and study_time are required"}, status=400)
            
            try:
                user = Student.objects.get(email=email)
                today = timezone.now().date()
                
                analytics, created = DashboardAnalytics.objects.get_or_create(
                    student=user,
                    date=today,
                    defaults={
                        'study_time': study_time,
                        'courses_accessed': courses_accessed,
                        'quizzes_completed': quizzes_completed,
                        'assignments_submitted': assignments_submitted
                    }
                )
                
                if not created:
                    analytics.study_time += study_time
                    analytics.courses_accessed += courses_accessed
                    analytics.quizzes_completed += quizzes_completed
                    analytics.assignments_submitted += assignments_submitted
                    analytics.save()
                
                return JsonResponse({"msg": "Study time updated"}, status=200)
                
            except Student.DoesNotExist:
                return JsonResponse({"err": "User does not exist"}, status=404)
                
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)

@csrf_exempt
def issue_certificate(request: HttpRequest) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            course_id = data.get('course_id')
            if not email or not course_id:
                return JsonResponse({"err": "Email and course_id are required"}, status=400)
            try:
                user = Student.objects.get(email=email)
                course = Course.objects.get(id=course_id)
                enrollment = Enrollment.objects.get(student=user, course=course)
            except (Student.DoesNotExist, Course.DoesNotExist, Enrollment.DoesNotExist):
                return JsonResponse({"err": "User, course or enrollment does not exist"}, status=404)
            
            if enrollment.certificate_issued:
                return JsonResponse({"msg": "Certificate already issued"}, status=200)
            
            enrollment.certificate_issued = True
            enrollment.completion_date = timezone.now()
            enrollment.save()
            
            # Create certificate record
            Certificate.objects.create(
                student=user,
                course=course,
                issued_date=timezone.now()
            )
            
            return JsonResponse({"msg": "Certificate issued successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"err": str(e)}, status=500)
    else:
        return JsonResponse({"err": "Invalid Method"}, status=405)
