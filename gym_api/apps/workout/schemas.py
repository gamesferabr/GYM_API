from ninja import Schema
from datetime import date
import uuid

class WorkoutIn(Schema):
    name: str
    description: str = None
    date: date

class WorkoutOut(Schema):
    id: uuid.UUID 
    name: str
    description: str
    date: date