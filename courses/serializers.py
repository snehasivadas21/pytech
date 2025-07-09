from rest_framework import serializers
from .models import (Course,CourseCategory,Module, Lesson,Enrollment,LessonProgress,
CourseCertificate,LessonResource,CourseReview)
from payment.models import CoursePurchase

class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = '__all__'

class InstructorCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        exclude = ['slug','rating','is_published','created_at','instructor','status'] 
        extra_kwargs = {
            'slug': {'read_only': True}
        }

        def create(self,validated_data):
            validated_data['instructor']=self.context['request'].user
            validated_data['status']='submitted'
            return super().create(validated_data)

        def update(self, instance, validated_data):
            validated_data.pop('instructor', None)
            validated_data.pop('status', None)
            return super().update(instance, validated_data)    

class AdminCourseSerializer(serializers.ModelSerializer):
    instructor_username = serializers.CharField(source='instructor.username', read_only=True)
    # category_name = serializers.CharField(source='category.name', read_only=True)    
    category = CourseCategorySerializer()

    class Meta:
        model=Course
        fields='__all__'   
        extra_kwargs = {
            'slug': {'read_only': True}
        }      

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = '__all__'   

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment 
        fields = ['id','student','course','enrolled_on','is_active']
        read_only_fields = ['id','enrolled_on']  

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress 
        fields = ['id','student','lesson','completed','completed_at'] 
        read_only_fields = ['id','student','completed_at']           

class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = CourseCertificate
        fields = ['id', 'course', 'course_title', 'issued_at', 'certificate_file']

class LessonResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonResource  
        fields =['id','lesson','title','file','uploaded_at']

    def validate_file(self, file):
        if file.size > 10 * 1024 * 1024:  
            raise serializers.ValidationError("File size too large (max 10MB).")
        if not file.name.endswith(('.pdf', '.docx', '.pptx')):
            raise serializers.ValidationError("Unsupported file type.")
        return file
    
class CourseReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseReview
        fields = ['id','course','rating','review','created_at']
        read_only_fields = ['created_at']

    def validate(self,data):
        user = self.context['request'].user
        course = data['course']

        if not CoursePurchase.objects.filter(student = user,course=course,is_paid=True).exists():
            raise serializers.ValidationError("You must purchase this course to leave a review")
        return data
    
    def create(self,validated_data):
        return CourseReview.objects.create(student = self.context['request'].user,**validated_data)
    
    
    

 