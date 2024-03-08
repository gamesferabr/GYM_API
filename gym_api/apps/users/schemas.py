from ninja import Schema

class UserCreateSchema(Schema):
    email: str
    password: str
    first_name: str
    last_name: str

class AuthSchema(Schema):
    email: str
    password: str
