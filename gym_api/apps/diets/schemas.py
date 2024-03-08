from ninja import Schema
from datetime import date

class DietIn(Schema):
    name: str
    description: str = None
    date: date

class DietOut(Schema):
    id: int
    name: str
    description: str
    date: date