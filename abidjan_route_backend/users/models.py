from django.db import models
from core.models import User, TransportMode  # import des modèles de base

class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferred_transport_modes = models.ManyToManyField(TransportMode, related_name="preferred_by_users")
    avoid_transport_modes = models.ManyToManyField(TransportMode, related_name="avoided_by_users")