from ninja import Schema
from datetime import date

class WorkoutIn(Schema):
    name: str
    description: str = None
    date: date

class WorkoutOut(Schema):
    id: int
    name: str
    description: str
    date: date