from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.db import models
from .models import CustomUser
from django.conf import settings
from rest_framework_simplejwt.tokens import TokenError

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token  # Obter o access token diretamente do refresh token
        
    return {
        'refresh': str(refresh),
        'access': str(access),
    }

def get_user_for_tokens(token):
    try:
        # Utilize o SimpleJWT para verificar o token ao invés de jwt diretamente
        valid_token = RefreshToken(token)  # Isso verifica a validade do token automaticamente
        user_id = valid_token['user_id']
        
        user = CustomUser.objects.get(id=user_id)
        return user
    
    except (TokenError, CustomUser.DoesNotExist) as e:  # TokenError cobre ambos os erros de expiração e invalidação
        return None

def get_new_access_token(refresh_token):
    try:
        valid_refresh_token = RefreshToken(refresh_token)
        access_token = valid_refresh_token.access_token
        return str(access_token)
    
    except TokenError:  # Captura qualquer erro relacionado ao token
        return None
