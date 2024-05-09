from ninja import Router
from apps.users.models import CustomUser
from apps.users.schemas import UserCreateSchema, AuthSchema
from django.contrib.auth import authenticate
from apps.users.tokens import get_tokens_for_user, RefreshToken
from django.http import JsonResponse
from django.http import HttpRequest, JsonResponse
from apps.auth.auth import is_auth_ninja
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required

router = Router()

@router.post("/users", response={201: None})
def create_user(request: HttpRequest, payload: UserCreateSchema):
    try:
        validate_password(payload.password)

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
        return JsonResponse({"detail": f"An unexpected error occurred: {str(e)}"}, status=500)


@router.post('/login', response={200: None})
def login(request: HttpRequest, auth: AuthSchema):
    try:
        user = authenticate(request, email=auth.email, password=auth.password)

        if user is None:
            return JsonResponse({"detail": "Invalid credentials."}, status=401)

        tokens = get_tokens_for_user(user)

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
    
    
@router.post('/logout/', response={200: None})
@is_auth_ninja
def logout(request: HttpRequest):
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        response = JsonResponse({"success": True, "message": "Logout successful."}, status=200)
        
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response
    
    except Exception as e:
        return JsonResponse({"error": "Invalid token or other error."}, status=400)


@router.post('/dashboard/', response={200:None})
@is_auth_ninja
def dashboard(request: HttpRequest):
    try:        
        # if not request.COOKIES.get('access_token'):
        #     return JsonResponse({"error": "No token provided."}, status=400)
        
        response = JsonResponse({"success":True, "message": "Dashboard successful"}, status = 200)
        return response

    except Exception as e:
        return({"error":"Invalid token"})