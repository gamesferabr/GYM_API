from ninja import Router
from .models import CustomUser
from .schemas import UserCreateSchema, AuthSchema
from django.contrib.auth import authenticate
from .tokens import get_tokens_for_user, RefreshToken
from django.http import JsonResponse
from django.http import HttpRequest, JsonResponse
from ..auth.auth import is_auth_ninja
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db import IntegrityError

router = Router()


@router.post("/users", response={201: None})
def create_user(request: HttpRequest, payload: UserCreateSchema):
    try:
        # Primeiro, valida a senha antes de criar o usuário
        validate_password(payload.password)

        # Agora, cria o usuário sem definir a senha ainda
        with transaction.atomic():
            
            user = CustomUser(
                email=payload.email,
                first_name=payload.first_name,
                last_name=payload.last_name,
            )
            
            user.set_password(payload.password)  # Definindo a senha de forma segura
            user.save()

        return JsonResponse({"id": user.id, "email": user.email}, status=201)
    
    except ValidationError as e:
        return JsonResponse({"detail": e.messages}, status=400)

    except IntegrityError as e:
        return JsonResponse({"detail": "This email is already in use."}, status=400)
        
    except Exception as e:
        # Captura outros tipos de erro não especificados anteriormente
        return JsonResponse({"detail": f"An unexpected error occurred: {str(e)}"}, status=500)


@router.post('/login', response={200: None})
def login(request: HttpRequest, auth: AuthSchema):
    try:
        user = authenticate(request, email=auth.email, password=auth.password)

        if user is None:
            return JsonResponse({"detail": "Invalid credentials."}, status=401)

        tokens = get_tokens_for_user(user)

        # Já que você autenticou o usuário, você pode usar diretamente os atributos do objeto `user`
        first_name = user.first_name
        last_name = user.last_name
        email = user.email

        # Preparar a resposta
        response_data = {
            "success": True, 
            "message": "Login successful.", 
            "data": tokens, 
            "username": first_name, 
            "lastname": last_name, 
            "email": email
        }

        response = JsonResponse(response_data, status=200)
        
        response.set_cookie(key='access_token', value=tokens['access'], httponly=True, samesite='Lax')  
        response.set_cookie(key='refresh_token', value=tokens['refresh'], httponly=True, samesite='Lax')
        
        return response

    except ValidationError as e:
        return JsonResponse({"detail": e.messages}, status=400)
    
    
@router.post('/logout/{access_token}', auth=is_auth_ninja, response={200: None})
def logout(request: HttpRequest, access_token):
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        
        if access_token is None:
            return JsonResponse({"error": "No refresh token provided."}, status=400)

        RefreshToken(refresh_token).blacklist()
        
        response = JsonResponse({"success": True, "message": "Logout successful."}, status=200)
        
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response
    
    except Exception as e:
        return JsonResponse({"error": "Invalid token or other error."}, status=400)


@router.post('/dashboard/{token}',auth=is_auth_ninja, response={200:None})
def dashboard(request: HttpRequest, token:str):
    try:
        if token:
            response = JsonResponse({"success":True, "message": "Dashboard successful"}, status = 200)
            return response
        
        else:
            return JsonResponse({"error":"No token provided."}, status=400)
    
    except Exception as e:
        return({"error":"Invalid token"})