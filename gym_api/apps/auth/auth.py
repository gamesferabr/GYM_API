from rest_framework_simplejwt.tokens import AccessToken, TokenError
from django.http import HttpRequest, JsonResponse
from functools import wraps

class IsAuthNinja:
    message = "Unauthorized"  # Mensagem de erro padrão

    @staticmethod
    def check(token: str):
        if not token:
            raise ValueError(IsAuthNinja.message)  # Se não houver token, lança uma exceção.

        try:
            # Verifica se o token é válido usando rest_framework_simplejwt
            AccessToken(token)  # Isso levantará uma exceção se o token for inválido ou expirado.
            return True
        
        except TokenError as e:
            raise ValueError(IsAuthNinja.message)

def is_auth_ninja(func):
    @wraps(func)
    def wrapper(request: HttpRequest, *args, **kwargs):
        token = request.COOKIES.get("access_token")
        try:
            IsAuthNinja.check(token)
            return func(request, *args, **kwargs)
        except ValueError as e:
            return JsonResponse({'message': str(e)}, status=401)
    return wrapper