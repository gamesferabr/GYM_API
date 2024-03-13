from rest_framework_simplejwt.tokens import RefreshToken
from django.db import models
import jwt
from .models import CustomUser
from django.conf import settings

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def get_user_for_tokens(token):
        try:
            
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        
            user_id = payload['user_id']
            
            user = CustomUser.objects.get(id=user_id)

            return user
        
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, CustomUser.DoesNotExist):
            return None