from ninja import Router,Path
from .models import Workout
from .schemas import WorkoutIn, WorkoutOut
from typing import List
from django.http import Http404,HttpRequest
from gym_api.apps.auth.auth import is_auth_ninja
from gym_api.apps.users.tokens import get_user_for_tokens

router = Router()

@router.post("/add", response=WorkoutOut, auth=is_auth_ninja)
def add_workout(request:HttpRequest, workout_in: WorkoutIn):
    token = request.COOKIES.get("access_token")
    user = get_user_for_tokens(token)
    
    workout = Workout.objects.create(**workout_in.dict(), user=user)
    return workout


@router.get("/", response=List[WorkoutOut], auth = is_auth_ninja)
def list_workouts(request:HttpRequest):
    token = request.COOKIES.get("access_token")
    user = get_user_for_tokens(token)
    
    workouts = Workout.objects.filter(user=user)
    return workouts


@router.put("/{workout_id}", response=WorkoutOut, auth= is_auth_ninja)
def update_workout(request:HttpRequest, workout_id: int, data: WorkoutIn):
    token = request.COOKIES.get("access_token")
    user = get_user_for_tokens(token)
    
    workout = Workout.objects.filter(id=workout_id, user=user).first()
    for attribute, value in data.dict().items():
        setattr(workout, attribute, value)
    workout.save()
    return workout


@router.delete("/{workout_id}", auth=is_auth_ninja)
def delete_workout(request:HttpRequest, workout_id: int):
    token = request.COOKIES.get("access_token")
    user = get_user_for_tokens(token)
    
    workout = Workout.objects.filter(id=workout_id, user=user)
    workout.delete()
    return {"success": True}


@router.get("/{workout_id}", response=WorkoutOut,auth=is_auth_ninja)
def get_workout(request:HttpRequest, workout_id: int = Path(...)):
    try:
        token = request.COOKIES.get("access_token")
        user = get_user_for_tokens(token)
    
        workout = Workout.objects.get(id=workout_id, user=user)
        return workout
    except Workout.DoesNotExist:
        raise Http404("Workout not found")