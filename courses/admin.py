from django.contrib import admin
from .models import Module,Lesson,QuizSubmission,AnswerSubmission

# Register your models here.
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(QuizSubmission)
admin.site.register(AnswerSubmission)
