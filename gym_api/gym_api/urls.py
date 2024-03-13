from django.contrib import admin
from django.urls import path, include
from ninja import NinjaAPI
from apps.users.api import router as users_router
from apps.workout.api import router as workouts_router
from apps.diets.api import router as diets_router
from apps.token.api import router as auth_router

# Cria uma instância do NinjaAPI e adiciona os routers
api = NinjaAPI()
api.add_router("/users/", users_router, tags=["Users"])
api.add_router("/workouts/", workouts_router, tags=["Workouts"])
api.add_router("/diets/", diets_router, tags=["Diets"])
api.add_router('/auth/', auth_router, tags=["Token"])

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),  # Inclui as rotas do NinjaAPI
    
]
