from ninja import Schema
from pydantic import  EmailStr, Field

class UserCreateSchema(Schema):
    email: EmailStr
    password: str = Field(min_lenght= 8, max_length=200)
    first_name: str = Field(min_lenght=2, max_lenght=150)
    last_name: str = Field(min_lenght=2, max_lenght=150)

class AuthSchema(Schema):
    email: EmailStr
    password: str = Field(min_length = 8, max_length=200)