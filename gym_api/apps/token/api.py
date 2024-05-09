from django.http import HttpRequest
from ninja import Router
from apps.users.tokens import get_tokens_for_user, get_new_access_token, get_user_for_tokens
from apps.token.schemas import TokenRefreshSchema, TokenResponseSchema
from apps.auth.auth import is_auth_ninja
router = Router()

@router.post("/token/refresh", response=TokenResponseSchema)
@is_auth_ninja
def refresh_token(request: HttpRequest):
    try:
        refresh_token = request.COOKIES.get("refresh_token")
        access = get_new_access_token(refresh_token)
        
        if not access:
            raise Exception("Invalid token")
        
        return {"access": access}
    
    except Exception as e:
        return {"error": str(e)}
