from django.http import Http404,HttpRequest
from ninja import Router,Path
from .models import Diet
from .schemas import DietIn, DietOut
from typing import List
from apps.auth.auth import is_auth_ninja
from apps.users.tokens import get_user_for_tokens

router = Router()

@router.post("/add", response=DietOut, auth=is_auth_ninja)
def add_diet(request:HttpRequest, diet_in: DietIn):
    token = request.COOKIES.get("refresh_token")
    user = get_user_for_tokens(token)
    
    diet = Diet.objects.create(**diet_in.dict(), user=user)
    return diet


@router.get("/search", response=List[DietOut], auth=is_auth_ninja)
def search_diets(request:HttpRequest, query: str):
    diets = Diet.objects.filter()
    return diets


@router.get("/", response=List[DietOut], auth=is_auth_ninja)
def list_diets(request:HttpRequest):
    token = request.COOKIES.get("refresh_token")
    user = get_user_for_tokens(token)
    
    diets = Diet.objects.filter(user=user)
    return diets


@router.put("/{diet_id}", response=DietOut,auth=is_auth_ninja)
def update_diet(request:HttpRequest, diet_id: int, data: DietIn):
    token = request.COOKIES.get("refresh_token")
    user = get_user_for_tokens(token)
    
    diet = Diet.objects.filter(id=diet_id, user=user).first()
    for attribute, value in data.dict().items():
        setattr(diet, attribute, value)
    diet.save()
    return diet


@router.delete("/{diet_id}",auth=is_auth_ninja)
def delete_diet(request:HttpRequest, diet_id: int):
    token = request.COOKIES.get("refresh_token")
    user = get_user_for_tokens(token)
    
    diet = Diet.objects.filter(id=diet_id, user=user)
    diet.delete()
    return {"success": True}


@router.get("/{diet_id}",response=DietOut, auth=is_auth_ninja)
def get_diet(request:HttpRequest, diet_id:int = Path(...)):
    try:    
        token = request.COOKIES.get("refresh_token")
        user = get_user_for_tokens(token)
    
        diet = Diet.objects.get(id= diet_id, user = user)
        return diet

    except Diet.DoesNotExist:
        raise Http404("Workout not found")