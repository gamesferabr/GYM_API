from django.contrib.auth.hashers import make_password
from ninja import Router
from .models import CustomUser
from .schemas import UserCreateSchema, AuthSchema
from django.contrib.auth import authenticate
from .tokens import get_tokens_for_user, RefreshToken
from django.http import JsonResponse
from django.http import HttpRequest, JsonResponse
from ..auth.auth import is_auth_ninja
router= Router()

@router.post("/users", response={201: None})
def create_user(request, payload: UserCreateSchema):
    user = CustomUser.objects.create(
        email=payload.email,
        password=make_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
    )
    
    return {"id": user.id, "email": user.email}

@router.post('/login')
def login(request:HttpRequest, auth: AuthSchema):
    user = authenticate(email=auth.email, password=auth.password)    
   
    if user:
        tokens = get_tokens_for_user(user)
        
        response = JsonResponse({"success": True, "message": "Login successful.", "data": tokens}, status=200)
        response.set_cookie(key='refresh_token', value=tokens['refresh'], httponly=True)
        
        return response
    
    else:
        return JsonResponse({"detail": "Invalid credentials"}, status=401)
    
# Ajuste a assinatura do método para usar HttpRequest
@router.post('/logout', auth=is_auth_ninja, response={200: None})
# Ajuste a assinatura do método para usar HttpRequest
def logout(request: HttpRequest):
    try:
        # Aqui, acessamos diretamente os cookies da solicitação recebida
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token is None:
            return JsonResponse({"error": "No refresh token provided."}, status=400)

        # Com o token de refresh obtido, podemos tentar invalidá-lo
        RefreshToken(refresh_token).blacklist()
        response = JsonResponse({"success": True, "message": "Logout successful."}, status=200)
        response.delete_cookie('refresh_token')  # Opcionalmente, remove o cookie
        return response
    except Exception as e:
        return JsonResponse({"error": "Invalid token or other error."}, status=400)