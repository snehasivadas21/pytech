from allauth.account.signals import user_signed_up
from django.dispatch import receiver

@receiver(user_signed_up)
def verify_social_user(sender,request,user,**kwargs):
    user.is_verified=True
    user.save()