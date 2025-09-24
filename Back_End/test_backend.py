# #!/usr/bin/env python
# """
# Test script to verify Django backend functionality
# """

# import sys
# import os
# import django
# from django.test import RequestFactory
# from django.http import JsonResponse
# import json

# # Add the project path to sys.path
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# # Setup Django
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
# django.setup()

# from app.views import register, loginview, list_courses
# from app.models import Student, Course

# def test_registration():
#     """Test user registration functionality"""
#     factory = RequestFactory()
    
#     # Test data
#     test_data = {
#         "username": "testuser",
#         "email": "test@example.com",
#         "password": "testpassword123"
#     }
    
#     # Create POST request
#     request = factory.post('/register/', 
#                           data=json.dumps(test_data),
#                           content_type='application/json')
    
#     # Call the view
#     response = register(request)
    
#     print("Registration Test:")
#     print(f"Status Code: {response.status_code}")
#     print(f"Response: {json.loads(response.content.decode())}")
    
#     return response.status_code == 200

# def test_course_listing():
#     """Test course listing functionality"""
#     factory = RequestFactory()
    
#     # Create some test courses
#     Course.objects.get_or_create(
#         id='python101',
#         defaults={
#             'title': 'Python Basics',
#             'description': 'Learn Python programming',
#             'duration': '4 weeks',
#             'icon': '🐍'
#         }
#     )
    
#     # Create GET request
#     request = factory.get('/courses/')
    
#     # Call the view
#     response = list_courses(request)
    
#     print("\nCourse Listing Test:")
#     print(f"Status Code: {response.status_code}")
#     print(f"Response: {json.loads(response.content.decode())}")
    
#     return response.status_code == 200

# if __name__ == "__main__":
#     print("Testing Django Backend Functionality...")
#     print("=" * 50)
    
#     try:
#         # Run tests
#         reg_success = test_registration()
#         course_success = test_course_listing()
        
#         print("\n" + "=" * 50)
#         print("Test Results:")
#         print(f"Registration Test: {'PASS' if reg_success else 'FAIL'}")
#         print(f"Course Listing Test: {'PASS' if course_success else 'FAIL'}")
        
#         if reg_success and course_success:
#             print("\n✅ All tests passed! Backend is working correctly.")
#         else:
#             print("\n❌ Some tests failed. Check the errors above.")
            
#     except Exception as e:
#         print(f"\n❌ Test execution failed: {str(e)}")
#         import traceback
#         traceback.print_exc()
