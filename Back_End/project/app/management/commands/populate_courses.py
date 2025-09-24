from typing import Any
from django.core.management.base import BaseCommand
from app.models import Course

class Command(BaseCommand):
    help = 'Populate the database with comprehensive course data'

    def handle(self, *args: Any, **kwargs: Any) -> None:
        courses_data = [
            {
                'id': 'webdev',
                'title': 'Web Development',
                'description': 'Learn HTML, CSS, JavaScript, and modern web development practices',
                'duration': '12 weeks',
                'icon': '🌐',
                'difficulty_level': 'Beginner',
                'category': 'Programming',
                'prerequisites': 'Basic computer skills',
                'learning_outcomes': [
                    'Build responsive websites',
                    'Master JavaScript fundamentals',
                    'Work with modern CSS frameworks',
                    'Deploy web applications'
                ]
            },
            {
                'id': 'reactjs',
                'title': 'ReactJS',
                'description': 'Master React.js including hooks, context, and state management',
                'duration': '8 weeks',
                'icon': '⚛️',
                'difficulty_level': 'Intermediate',
                'category': 'Frontend',
                'prerequisites': 'JavaScript fundamentals',
                'learning_outcomes': [
                    'Build interactive UIs with React',
                    'Manage application state',
                    'Implement React Router',
                    'Deploy React applications'
                ]
            },
            {
                'id': 'expressjs',
                'title': 'ExpressJS',
                'description': 'Build robust backend services with Express.js and Node.js',
                'duration': '6 weeks',
                'icon': '🚀',
                'difficulty_level': 'Intermediate',
                'category': 'Backend',
                'prerequisites': 'JavaScript fundamentals',
                'learning_outcomes': [
                    'Create RESTful APIs',
                    'Handle authentication and authorization',
                    'Work with databases',
                    'Deploy Node.js applications'
                ]
            },
            {
                'id': 'django',
                'title': 'Django',
                'description': 'Create powerful web applications with Python and Django',
                'duration': '10 weeks',
                'icon': '🐍',
                'difficulty_level': 'Intermediate',
                'category': 'Backend',
                'prerequisites': 'Python fundamentals',
                'learning_outcomes': [
                    'Build web applications with Django',
                    'Work with Django ORM',
                    'Implement authentication systems',
                    'Deploy Django applications'
                ]
            },
            {
                'id': 'java',
                'title': 'Java',
                'description': 'Learn core Java programming and enterprise development',
                'duration': '14 weeks',
                'icon': '☕',
                'difficulty_level': 'Intermediate',
                'category': 'Programming',
                'prerequisites': 'Basic programming knowledge',
                'learning_outcomes': [
                    'Master Java syntax and OOP',
                    'Work with Java collections',
                    'Build desktop applications',
                    'Understand Java enterprise concepts'
                ]
            },
            {
                'id': 'python',
                'title': 'Python',
                'description': 'Master Python programming from basics to advanced concepts',
                'duration': '10 weeks',
                'icon': '🐍',
                'difficulty_level': 'Beginner',
                'category': 'Programming',
                'prerequisites': 'None',
                'learning_outcomes': [
                    'Master Python syntax',
                    'Work with data structures',
                    'Build automation scripts',
                    'Understand object-oriented programming'
                ]
            },
            {
                'id': 'aws',
                'title': 'AWS',
                'description': 'Cloud computing and deployment with Amazon Web Services',
                'duration': '8 weeks',
                'icon': '☁️',
                'difficulty_level': 'Advanced',
                'category': 'Cloud',
                'prerequisites': 'Basic computer skills',
                'learning_outcomes': [
                    'Understand cloud computing concepts',
                    'Work with AWS services',
                    'Deploy applications to AWS',
                    'Manage cloud infrastructure'
                ]
            },
            {
                'id': 'ai',
                'title': 'AI',
                'description': 'Artificial Intelligence fundamentals and applications',
                'duration': '12 weeks',
                'icon': '🤖',
                'difficulty_level': 'Advanced',
                'category': 'AI/ML',
                'prerequisites': 'Python programming, Mathematics',
                'learning_outcomes': [
                    'Understand AI concepts',
                    'Work with machine learning algorithms',
                    'Build AI models',
                    'Deploy AI applications'
                ]
            },
            {
                'id': 'genai',
                'title': 'Generative AI',
                'description': 'Learn about LLMs, diffusion models, and AI content generation',
                'duration': '8 weeks',
                'icon': '🎨',
                'difficulty_level': 'Advanced',
                'category': 'AI/ML',
                'prerequisites': 'Python programming, AI basics',
                'learning_outcomes': [
                    'Understand generative AI concepts',
                    'Work with large language models',
                    'Build AI content generators',
                    'Deploy generative AI applications'
                ]
            },
            {
                'id': 'devops',
                'title': 'DevOps',
                'description': 'Master CI/CD, containerization, and deployment automation',
                'duration': '10 weeks',
                'icon': '⚙️',
                'difficulty_level': 'Advanced',
                'category': 'DevOps',
                'prerequisites': 'Basic programming knowledge',
                'learning_outcomes': [
                    'Understand DevOps practices',
                    'Work with CI/CD pipelines',
                    'Containerize applications',
                    'Automate deployment processes'
                ]
            }
        ]

        created_count = 0
        updated_count = 0

        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                id=course_data['id'],
                defaults=course_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created course: {course.title}')
                )
            else:
                updated_count += 1
                self.stdout.write(f'Updated course: {course.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated courses: {created_count} created, {updated_count} updated'
            )
        )
