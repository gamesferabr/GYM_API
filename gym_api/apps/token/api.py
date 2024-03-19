from django.http import HttpRequest
from ninja import Router
import jwt
from django.conf import settings
from apps.users.models import CustomUser
from apps.users.tokens import get_tokens_for_user
from apps.token.schemas import TokenRefreshSchema, TokenResponseSchema

router = Router()

@router.post("/token/refresh", response=TokenResponseSchema)
def refresh_token(request: HttpRequest, data: TokenRefreshSchema):
    try:
        # Decodifica o refresh_token para obter o id do usuário
        payload = jwt.decode(data.refresh, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = CustomUser.objects.get(id=user_id)

        # Gera novos tokens
        tokens = get_tokens_for_user(user)
        
        return {"access": tokens["access"]}
    
    except Exception as e:
        return {"error": str(e)}
