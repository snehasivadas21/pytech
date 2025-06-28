from rest_framework import serializers
from .models import Course,CourseCategory,Module, Lesson

class CourseSerializer(serializers.ModelSerializer):
    instructor_username = serializers.CharField(source='instructor.username',read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'category',
            'status',
            'is_active',
            'instructor',
            'instructor_username',
            'created_at',
            'course_image',
            'rating',
            'price',
            'is_published',
        ]
        read_only_fields = ['id','created_at','instructor_username']

class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = '__all__'        