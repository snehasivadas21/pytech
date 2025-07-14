from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from courses.models import Course,Module
from quiz.models import Quiz,Question,Choice

User = get_user_model()

class QuizSubmissionAPITestCase(APITestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(
            username='instructor1',email='i@gmail.com',password='test1234',role='instructor')
        self.student=User.objects.create_user(
            username='student1',email='s@gmail.com',password='test1234',role='student')
        self.course=Course.objects.create(
            title='Python',instructor=self.instructor,price=0,description='xyz')
        self.module= Module.objects.create(
            course=self.course,title='Basics')
        
        self.quiz=Quiz.objects.create(
            module=self.module,title='Quiz 1')
        self.question=Question.objects.create(
            quiz=self.quiz,text='What is 2+2?')
        self.choice1=Choice.objects.create(
            question=self.question,text='3',is_correct=False)
        self.choice2=Choice.objects.create(
            question=self.question,text='4',is_correct=True)
        
        self.client.login(email='student1@gmail.com',password='test1234')

        
    def test_quiz_submission_success(self):
        url = reverse('quiz-submission-list')
        data = {
            'quiz':self.quiz.id,
            'answers':[
                {
                    'question':self.question.id,
                    'selected_choice':self.choice2.id
                }
            ]
        }
        self.client.force_authenticate(user=self.student)
        response = self.client.post(url,data,format='json')

        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertIn('score',response.data)
        self.assertEqual(float(response.data['score']),100.0)