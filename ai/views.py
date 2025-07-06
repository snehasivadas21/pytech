import openai,os
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import BotChat
from .serializers import BotChatSerializer

openai.api_key = os.getenv("OPENAI_API_KEY") 

class BotChatViewSet(viewsets.ModelViewSet):
    queryset = BotChat.objects.all()
    serializer_class = BotChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BotChat.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        question = self.request.data.get("question", "")
        course = serializer.validated_data.get("course")
        user = self.request.user
        course_context = f"This question is asked by a student about the course: '{course.title}'." if course else "This is a general question."
        # Call OpenAI GPT
        response_text = self.ask_gpt(question,course_context)

        serializer.save(user=user, response=response_text)

    def ask_gpt(self, question):
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful course assistant for students.{course_context}"},
                    {"role": "user", "content": question},
                ],
                max_tokens=400,
                temperature=0.7,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return "Sorry, something went wrong with the AI."

