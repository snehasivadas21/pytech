from django.test import TestCase
from django.contrib.auth import get_user_model
from courses.models import Course
from payment.models import CoursePurchase
from django.db.utils import IntegrityError

User = get_user_model()

class CourseEnrollmentTestCase(TestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(username='instructor1',email='instructor1@gmail.com', password='test1234',role=True)
        self.student = User.objects.create_user(username='student1',email='student1@gmail.com',password='test1234',role=True)
        self.course = Course.objects.create(
            title = 'Advanced Python',
            price = 499.00,
            instructor = self.instructor,
            description = 'Learn advanced concepts of Python'
        )

    def test_free_course_enrollment(self):
        self.course.price = 0
        self.course.save()

        purchase = CoursePurchase.objects.create(student=self.student,course=self.course,is_paid=False)

        self.assertEqual(purchase.student,self.student)
        self.assertEqual(purchase.course.title,'Advanced Python')
        self.assertFalse(purchase.is_paid)

    def test_paid_course_enrollment(self):
        purchase = CoursePurchase.objects.create(student=self.student,course=self.course,is_paid=True)

        self.assertEqual(purchase.student.username,'student1')
        self.assertEqual(purchase.course.price,499.00)
        self.assertTrue(purchase.is_paid)

    def test_duplicate_entrollment_not_allowed(self):
        CoursePurchase.objects.create(student=self.student,course=self.course,is_paid=True)

        with self.assertRaises(IntegrityError):
            CoursePurchase.objects.create(student=self.student,course=self.course,is_paid=True)  