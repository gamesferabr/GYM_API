from django.http import Http404,HttpRequest
from ninja import Router,Path
from .models import Diet
from .schemas import DietIn, DietOut
from typing import List
from apps.auth.auth import is_auth_ninja
from apps.users.tokens import get_user_for_tokens
from django.utils import timezone

router = Router()

@router.post("/add/{token}", response=DietOut, auth=is_auth_ninja)
def add_diet(request:HttpRequest, diet_in: DietIn,token:str):
        
    user = get_user_for_tokens(token)
    
    try:
            diet = Diet.objects.create(**diet_in.dict(), user=user)
            return diet
    except Exception as e:
            print(f"Error creating diet: {e}")


@router.get("/", response=List[DietOut], auth=is_auth_ninja)
def list_diets(request:HttpRequest):
    token = request.COOKIES.get("access_token")
    user = get_user_for_tokens(token)
    
    diets = Diet.objects.filter(user=user)
    return diets


@router.delete("/{diet_id}",auth=is_auth_ninja)
def delete_diet(request:HttpRequest, diet_id: int):
    token = request.COOKIES.get("access_token")
    user = get_user_for_tokens(token)
    
    diet = Diet.objects.filter(id=diet_id, user=user)
    diet.delete()
    return {"success": True}


@router.get("/{diet_id}",response=DietOut, auth=is_auth_ninja)
def get_diet(request:HttpRequest, diet_id:int = Path(...)):
    try:    
        token = request.COOKIES.get("access_token")
        user = get_user_for_tokens(token)
    
        diet = Diet.objects.get(id= diet_id, user = user)
        return diet

    except Diet.DoesNotExist:
        raise Http404("Workout not found")


@router.get("/today/{meal_type}/{token}", response=List[DietOut], auth=is_auth_ninja)
def get_today_diets_by_meal_type(request: HttpRequest, meal_type: str, token: str):
    
    # Obter o usuário autenticado
    user = get_user_for_tokens(token)
        
    # Obter a data atual
    today = timezone.now().date()
    
    # Filtrar dietas do usuário baseadas no tipo de refeição e na data atual
    diets = Diet.objects.filter(user=user, mealtype=meal_type, date=today)
    
    return diets



@router.get("/{date}/{meal_type}/{token}", response=List[DietOut], auth=is_auth_ninja)
def get_today_diets_by_meal_type(request: HttpRequest, meal_type: str, token: str, date: str):
    
    # Obter o usuário autenticado
    user = get_user_for_tokens(token)
        
    # Obter a data que o usuário deseja
    today = date
    
    # Filtrar dietas do usuário baseadas no tipo de refeição e na data atual
    diets = Diet.objects.filter(user=user, mealtype=meal_type, date=today)
    
    return diets

