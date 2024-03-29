from ninja import Schema
from datetime import date
import uuid

class DietIn(Schema):
    name: str
    description: str = None
    date: date
    mealtype:str
    
class DietOut(Schema):
    id: uuid.UUID  # Usando uuid.UUID aqui
    name: str
    description: str
    date: date
    mealtype:str