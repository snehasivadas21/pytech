from reportlab.pdfgen import canvas
from django.core.files.base import ContentFile
from io import BytesIO
import uuid

def generate_certificate(student_name, course_title):
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    p.setFont("Helvetica-Bold", 20)
    p.drawString(100, 750, "Certificate of Completion")
    p.setFont("Helvetica", 14)
    p.drawString(100, 700, f"This certifies that {student_name}")
    p.drawString(100, 675, f"has successfully completed the course: {course_title}")
    p.drawString(100, 640, "Issued by PyTech Learning")
    p.showPage()
    p.save()
    buffer.seek(0)
    return ContentFile(buffer.read(), name=f"{uuid.uuid4().hex}.pdf")

