from django.db import models
from core.models import Location, TransportMode, User  # import nécessaire

class TransportStop(models.Model):
    name = models.CharField(max_length=200)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    transport_mode = models.ForeignKey(TransportMode, on_delete=models.CASCADE)

class TransportRoute(models.Model):
    name = models.CharField(max_length=200)
    stops = models.ManyToManyField(TransportStop)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)