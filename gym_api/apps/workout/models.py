# Create your models here.
from django.db import models
from django.conf import settings
import uuid

class Workout(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workouts')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    def __str__(self):
        return self.name
