from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from app.models import Quiz, Assignment, Course

class Command(BaseCommand):
    help = 'Create sample assignments and quizzes for courses'

    def handle(self, *args, **options):
        # Sample assignments
        assignments_data = [
            {
                'course_id': 'webdev',
                'title': 'Build a Personal Portfolio',
                'description': 'Create a responsive personal portfolio website using HTML, CSS, and JavaScript',
                'instructions': 'Create a portfolio with sections for About, Projects, Skills, and Contact. Use modern CSS techniques and make it mobile-responsive.',
                'max_score': 100,
                'due_date': timezone.now() + timedelta(days=14)
            },
            {
                'course_id': 'reactjs',
                'title': 'Todo App with React',
                'description': 'Build a todo application using React hooks and state management',
                'instructions': 'Create a todo app with features like adding, editing, deleting todos, and filtering by status.',
                'max_score': 100,
                'due_date': timezone.now() + timedelta(days=10)
            },
            {
                'course_id': 'python',
                'title': 'Data Analysis Project',
                'description': 'Analyze a dataset using Python and pandas',
                'instructions': 'Choose a dataset and perform analysis including data cleaning, visualization, and insights.',
                'max_score': 100,
                'due_date': timezone.now() + timedelta(days=21)
            }
        ]

        # Sample quizzes
        quizzes_data = [
            {
                'course_id': 'webdev',
                'title': 'HTML & CSS Fundamentals',
                'description': 'Test your knowledge of HTML and CSS basics',
                'questions': [
                    {
                        'id': 'q1',
                        'question': 'What does HTML stand for?',
                        'options': ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
                        'correct_answer': 'HyperText Markup Language'
                    },
                    {
                        'id': 'q2',
                        'question': 'Which CSS property is used to change the background color?',
                        'options': ['color', 'background-color', 'bg-color', 'background'],
                        'correct_answer': 'background-color'
                    },
                    {
                        'id': 'q3',
                        'question': 'What is the correct HTML element for the largest heading?',
                        'options': ['<heading>', '<h1>', '<h6>', '<head>'],
                        'correct_answer': '<h1>'
                    }
                ],
                'time_limit': 20,
                'max_attempts': 3,
                'passing_score': 70
            },
            {
                'course_id': 'reactjs',
                'title': 'React Components & Hooks',
                'description': 'Test your knowledge of React components and hooks',
                'questions': [
                    {
                        'id': 'q1',
                        'question': 'What is JSX?',
                        'options': ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
                        'correct_answer': 'JavaScript XML'
                    },
                    {
                        'id': 'q2',
                        'question': 'Which hook is used for side effects in React?',
                        'options': ['useEffect', 'useState', 'useContext', 'useReducer'],
                        'correct_answer': 'useEffect'
                    }
                ],
                'time_limit': 25,
                'max_attempts': 3,
                'passing_score': 75
            },
            {
                'course_id': 'python',
                'title': 'Python Basics',
                'description': 'Test your knowledge of Python fundamentals',
                'questions': [
                    {
                        'id': 'q1',
                        'question': 'What is the correct file extension for Python files?',
                        'options': ['.py', '.python', '.pt', '.pyt'],
                        'correct_answer': '.py'
                    },
                    {
                        'id': 'q2',
                        'question': 'Which of the following is used to define a function in Python?',
                        'options': ['def', 'function', 'func', 'define'],
                        'correct_answer': 'def'
                    }
                ],
                'time_limit': 15,
                'max_attempts': 3,
                'passing_score': 80
            }
        ]

        assignment_count = 0
        quiz_count = 0

        # Create assignments
        for assignment_data in assignments_data:
            try:
                course = Course.objects.get(id=assignment_data['course_id'])
                assignment, created = Assignment.objects.get_or_create(
                    course=course,
                    title=assignment_data['title'],
                    defaults={
                        'description': assignment_data['description'],
                        'instructions': assignment_data['instructions'],
                        'max_score': assignment_data['max_score'],
                        'due_date': assignment_data['due_date']
                    }
                )
                if created:
                    assignment_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Created assignment: {assignment.title}')
                    )
                else:
                    self.stdout.write(f'Assignment already exists: {assignment.title}')
            except Course.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Course {assignment_data["course_id"]} not found, skipping assignment {assignment_data["title"]}')
                )

        # Create quizzes
        for quiz_data in quizzes_data:
            try:
                course = Course.objects.get(id=quiz_data['course_id'])
                quiz, created = Quiz.objects.get_or_create(
                    course=course,
                    title=quiz_data['title'],
                    defaults={
                        'description': quiz_data['description'],
                        'questions': quiz_data['questions'],
                        'time_limit': quiz_data['time_limit'],
                        'max_attempts': quiz_data['max_attempts'],
                        'passing_score': quiz_data['passing_score']
                    }
                )
                if created:
                    quiz_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Created quiz: {quiz.title}')
                    )
                else:
                    self.stdout.write(f'Quiz already exists: {quiz.title}')
            except Course.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'Course {quiz_data["course_id"]} not found, skipping quiz {quiz_data["title"]}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created: {assignment_count} assignments, {quiz_count} quizzes'
            )
        )
