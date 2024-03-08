from rest_framework.permissions import BasePermission
from apps.users.tokens import get_user_for_tokens, get_tokens_for_user
from django.http import HttpRequest, JsonResponse

# Adapte a classe IsAuth para funcionar com Django Ninja
class IsAuthNinja:
    message = "Você não tem permissão para executar essa ação"
    
    @staticmethod
    def check(token:str):
        jwt_token = token        
        user = get_user_for_tokens(jwt_token)
        
        get_token = get_tokens_for_user(user)
        
        if jwt_token != get_token['access'] or not token:
            return JsonResponse({'message': 'Você não tem permissão para executar essa ação'}, status=401)
        
        return jwt_token

# Defina uma função de autenticação para usar com o decorador auth=
def is_auth_ninja(request:HttpRequest):
    token = request.COOKIES.get('access_token')

    if not token or not IsAuthNinja.check(token):
        return JsonResponse({'message': 'Você não tem permissão para executar essa ação'}, status=401)
    
    return IsAuthNinja.check(token)