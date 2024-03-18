from django.http import Http404,HttpRequest, HttpResponseBadRequest
from ninja import Router,Path
from .models import Diet
from .schemas import DietIn, DietOut
from typing import List
from gym_api.apps.auth.auth import is_auth_ninja
from gym_api.apps.users.tokens import get_user_for_tokens
from django.utils import timezone
from datetime import datetime

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


@router.delete("delete/{diet_id}/{token}",auth=is_auth_ninja)
def delete_diet(request:HttpRequest, diet_id: str, token:str):
    user = get_user_for_tokens(token)
    
    diet = Diet.objects.filter(id=diet_id, user=user)
    diet.delete()
    
    return {"success": True}


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
def get_data_diets_by_meal_type(request: HttpRequest, date: str, meal_type: str, token: str):
    
    # Obter o usuário autenticado
    user = get_user_for_tokens(token)
        
    # Converter a string de data para um objeto date
    try:
        # Assumindo que a data esteja no formato "YYYY-MM-DD"
        desired_date = datetime.strptime(date, "%Y-%m-%d").date()
        
    except ValueError:
        # Retornar uma resposta de erro se a data não estiver no formato esperado
        return HttpResponseBadRequest("Invalid date format. Use YYYY-MM-DD.")
    
    # Filtrar dietas do usuário baseadas no tipo de refeição e na data desejada
    diets = Diet.objects.filter(user=user, mealtype=meal_type, date=desired_date)
    
    return diets