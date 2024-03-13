from ninja import Schema
from rest_framework_simplejwt.tokens import RefreshToken

class TokenRefreshSchema(Schema):
    refresh: str

class TokenResponseSchema(Schema):
    access: str