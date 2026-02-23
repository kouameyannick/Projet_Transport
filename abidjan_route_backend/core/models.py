"""
Modèles Django pour l'application Abidjan Route
PostgreSQL + PostGIS

Installation requise:
pip install django djangorestframework psycopg2-binary django-cors-headers
pip install django-phonenumber-field phonenumbers
pip install pillow
"""

import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models as gis_models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField



# ============================================================================
# MODÈLES DE BASE
# ============================================================================

class TimeStampedModel(models.Model):
    """Modèle abstrait avec timestamps"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True


# ============================================================================
# UTILISATEURS
# ============================================================================

class User(AbstractUser):
    """Utilisateur étendu"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    phone_number = PhoneNumberField(blank=True, null=True, region='CI')
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    preferred_language = models.CharField(
        max_length=2,
        choices=[('fr', 'Français'), ('en', 'English')],
        default='fr'
    )


    # ⚠️ Définir des related_name uniques pour éviter les conflits
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='core_user_set',  # <- unique
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='core_user_permissions_set',  # <- unique
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    # Supprimer le champ username et utiliser email comme identifiant
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"


# ============================================================================
# GÉOGRAPHIE
# ============================================================================

class Location(TimeStampedModel):
    """Lieux : communes et quartiers d'Abidjan"""
    
    LOCATION_TYPES = [
        ('commune', 'Commune'),
        ('quartier', 'Quartier'),
    ]
    
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True, max_length=250)
    type = models.CharField(max_length=20, choices=LOCATION_TYPES, db_index=True)
    parent_location = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sub_locations'
    )
    coordinates = gis_models.PointField(srid=4326, spatial_index=True)
    bounds = gis_models.PolygonField(srid=4326, null=True, blank=True, spatial_index=True)
    population = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'locations'
        verbose_name = 'Lieu'
        verbose_name_plural = 'Lieux'
        ordering = ['type', 'name']
        indexes = [
            models.Index(fields=['name', 'type']),
        ]

    def __str__(self):
        if self.parent_location:
            return f"{self.name} ({self.parent_location.name})"
        return self.name


# ============================================================================
# TRANSPORT
# ============================================================================

class TransportMode(TimeStampedModel):
    """Modes de transport disponibles"""
    
    TRANSPORT_TYPES = [
        ('bus', 'Bus'),
        ('taxi', 'Taxi'),
        ('train', 'Train'),
        ('metro', 'Métro'),
        ('gbaka', 'Gbaka'),
        ('woro', 'Woro-Woro'),
        ('car_rental', 'Location de voiture'),
    ]
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    type = models.CharField(max_length=20, choices=TRANSPORT_TYPES, db_index=True)
    icon = models.CharField(max_length=10, help_text="Emoji ou classe d'icône")
    color = models.CharField(max_length=7, help_text="Code couleur hex")
    description = models.TextField(blank=True)
    
    # Tarification
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Prix de base en FCFA"
    )
    price_per_km = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Prix par kilomètre en FCFA"
    )
    
    # Performance
    average_speed = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Vitesse moyenne en km/h"
    )
    
    # Évaluations
    comfort_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=3
    )
    security_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=3
    )
    
    # Horaires
    operating_hours_start = models.TimeField(null=True, blank=True)
    operating_hours_end = models.TimeField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'transport_modes'
        verbose_name = 'Mode de transport'
        verbose_name_plural = 'Modes de transport'
        ordering = ['name']

    def __str__(self):
        return self.name


class TransportStop(TimeStampedModel):
    """Arrêts de transport"""
    
    STOP_TYPES = [
        ('bus_stop', 'Arrêt de bus'),
        ('train_station', 'Gare'),
        ('metro_station', 'Station de métro'),
        ('taxi_stand', 'Station de taxi'),
        ('terminal', 'Terminal'),
    ]
    
    name = models.CharField(max_length=200)
    transport_mode = models.ForeignKey(
        TransportMode,
        on_delete=models.CASCADE,
        related_name='stops'
    )
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='transport_stops'
    )
    coordinates = gis_models.PointField(srid=4326, spatial_index=True)
    address = models.TextField(blank=True)
    stop_type = models.CharField(max_length=20, choices=STOP_TYPES)
    amenities = models.JSONField(
        default=dict,
        blank=True,
        help_text="Équipements: {shelter: true, bench: true, etc.}"
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'transport_stops'
        verbose_name = 'Arrêt de transport'
        verbose_name_plural = 'Arrêts de transport'
        ordering = ['name']
        indexes = [
            models.Index(fields=['transport_mode', 'location']),
        ]

    def __str__(self):
        return f"{self.name} ({self.transport_mode.name})"


class TransportRoute(TimeStampedModel):
    """Lignes de transport fixes"""
    
    name = models.CharField(max_length=200, help_text="Ex: Ligne 81")
    code = models.CharField(max_length=20, help_text="Ex: L81")
    transport_mode = models.ForeignKey(
        TransportMode,
        on_delete=models.CASCADE,
        related_name='routes'
    )
    origin_stop = models.ForeignKey(
        TransportStop,
        on_delete=models.CASCADE,
        related_name='routes_from'
    )
    destination_stop = models.ForeignKey(
        TransportStop,
        on_delete=models.CASCADE,
        related_name='routes_to'
    )
    route_path = gis_models.LineStringField(srid=4326, spatial_index=True)
    distance_km = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    estimated_duration_minutes = models.IntegerField(
        validators=[MinValueValidator(0)]
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    frequency_minutes = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Fréquence de passage en minutes"
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'transport_routes'
        verbose_name = 'Ligne de transport'
        verbose_name_plural = 'Lignes de transport'
        ordering = ['transport_mode', 'code']
        indexes = [
            models.Index(fields=['transport_mode', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} - {self.origin_stop.name} → {self.destination_stop.name}"


class RouteSegment(TimeStampedModel):
    """Segments d'itinéraire entre arrêts successifs"""
    
    transport_route = models.ForeignKey(
        TransportRoute,
        on_delete=models.CASCADE,
        related_name='segments'
    )
    from_stop = models.ForeignKey(
        TransportStop,
        on_delete=models.CASCADE,
        related_name='segments_from'
    )
    to_stop = models.ForeignKey(
        TransportStop,
        on_delete=models.CASCADE,
        related_name='segments_to'
    )
    segment_order = models.IntegerField(help_text="Ordre dans l'itinéraire")
    segment_path = gis_models.LineStringField(srid=4326, spatial_index=True)
    distance_km = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    duration_minutes = models.IntegerField(
        validators=[MinValueValidator(0)]
    )

    class Meta:
        db_table = 'route_segments'
        verbose_name = 'Segment d\'itinéraire'
        verbose_name_plural = 'Segments d\'itinéraire'
        ordering = ['transport_route', 'segment_order']
        unique_together = [['transport_route', 'segment_order']]

    def __str__(self):
        return f"{self.transport_route.name} - Segment {self.segment_order}"


# ============================================================================
# HISTORIQUE ET PRÉFÉRENCES
# ============================================================================

class SearchHistory(TimeStampedModel):
    """Historique des recherches d'itinéraires"""
    
    CRITERIA_CHOICES = [
        ('fastest', 'Plus rapide'),
        ('cheapest', 'Moins cher'),
        ('balanced', 'Équilibré'),
        ('safest', 'Plus sécurisé'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='search_history'
    )
    session_id = models.UUIDField(default=uuid.uuid4, db_index=True)
    origin = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='searches_from'
    )
    destination = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='searches_to'
    )
    origin_coordinates = gis_models.PointField(
        srid=4326,
        null=True,
        blank=True,
        spatial_index=True
    )
    destination_coordinates = gis_models.PointField(
        srid=4326,
        null=True,
        blank=True,
        spatial_index=True
    )
    search_criteria = models.CharField(
        max_length=20,
        choices=CRITERIA_CHOICES,
        default='balanced'
    )
    selected_transport_mode = models.ForeignKey(
        TransportMode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    search_date = models.DateTimeField(auto_now_add=True, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        db_table = 'search_history'
        verbose_name = 'Recherche'
        verbose_name_plural = 'Historique des recherches'
        ordering = ['-search_date']
        indexes = [
            models.Index(fields=['user', 'search_date']),
            models.Index(fields=['origin', 'destination']),
        ]

    def __str__(self):
        user_str = self.user.email if self.user else 'Anonyme'
        return f"{user_str}: {self.origin.name} → {self.destination.name}"


class UserPreference(TimeStampedModel):
    """Préférences utilisateur"""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='preferences'
    )
    default_criteria = models.CharField(
        max_length=20,
        choices=SearchHistory.CRITERIA_CHOICES,
        default='balanced'
    )
    preferred_transport_modes = models.ManyToManyField(
        TransportMode,
        related_name='preferred_by',
        blank=True
    )
    avoid_transport_modes = models.ManyToManyField(
        TransportMode,
        related_name='avoided_by',
        blank=True
    )
    max_walking_distance = models.IntegerField(
        default=500,
        validators=[MinValueValidator(0)],
        help_text="Distance maximale de marche en mètres"
    )
    accessibility_needs = models.BooleanField(default=False)
    budget_preference = models.CharField(
        max_length=10,
        choices=[('low', 'Faible'), ('medium', 'Moyen'), ('high', 'Élevé')],
        default='medium'
    )
    comfort_preference = models.CharField(
        max_length=10,
        choices=[('low', 'Faible'), ('medium', 'Moyen'), ('high', 'Élevé')],
        default='medium'
    )
    security_preference = models.CharField(
        max_length=10,
        choices=[('low', 'Faible'), ('medium', 'Moyen'), ('high', 'Élevé')],
        default='high'
    )
    notifications_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_preferences'
        verbose_name = 'Préférence utilisateur'
        verbose_name_plural = 'Préférences utilisateurs'

    def __str__(self):
        return f"Préférences de {self.user.email}"


# ============================================================================
# ÉVALUATIONS
# ============================================================================

class Rating(TimeStampedModel):
    """Évaluations des utilisateurs"""
    
    RATING_TYPES = [
        ('transport', 'Transport'),
        ('hotel', 'Hôtel'),
        ('restaurant', 'Restaurant'),
        ('car_rental', 'Location de voiture'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    
    # Generic relation pour évaluer différents types d'objets
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    rating_type = models.CharField(max_length=20, choices=RATING_TYPES)
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    # Évaluations détaillées
    comfort_rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    security_rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    cleanliness_rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    punctuality_rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    comment = models.TextField(blank=True)

    class Meta:
        db_table = 'ratings'
        verbose_name = 'Évaluation'
        verbose_name_plural = 'Évaluations'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['user', 'created_at']),
        ]
        unique_together = [['user', 'content_type', 'object_id']]

    def __str__(self):
        return f"{self.user.email} - {self.rating}/5"


# ============================================================================
# POINTS D'INTÉRÊT (POI)
# ============================================================================

class Hotel(TimeStampedModel):

            # Fonction pour retourner la location par défaut
    def get_default_location():
        return Location.objects.get_or_create(name="Abidjan Centre")[0].id
    """Hôtels"""
    
    PRICE_RANGES = [
        ('budget', 'Budget'),
        ('moderate', 'Modéré'),
        ('luxury', 'Luxe'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    location = models.ForeignKey(
    Location,
    on_delete=models.CASCADE,
    related_name='hotels',
    default=get_default_location  
)
    coordinates = gis_models.PointField(srid=4326, spatial_index=True)
    address = models.TextField()
    phone = PhoneNumberField(region='CI')
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    
    # Étoiles officielles
    star_rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    # Évaluations utilisateurs
    average_rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    rating_count = models.IntegerField(default=0)
    
    # Prix
    price_range = models.CharField(max_length=10, choices=PRICE_RANGES)
    min_price_fcfa = models.IntegerField(validators=[MinValueValidator(0)])
    max_price_fcfa = models.IntegerField(validators=[MinValueValidator(0)])
    
    # Détails
    amenities = models.JSONField(
        default=dict,
        help_text="Équipements: {wifi: true, pool: true, restaurant: true, etc.}"
    )
    description = models.TextField(blank=True)
    photos = models.JSONField(
        default=list,
        blank=True,
        help_text="URLs des photos"
    )
    
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'hotels'
        verbose_name = 'Hôtel'
        verbose_name_plural = 'Hôtels'
        ordering = ['name']
        indexes = [
            models.Index(fields=['location', 'is_active']),
            models.Index(fields=['price_range']),
        ]

    def __str__(self):
        return self.name
    




class Restaurant(TimeStampedModel):
    """Restaurants"""
    
    PRICE_RANGES = [
        ('cheap', 'Économique'),
        ('moderate', 'Modéré'),
        ('expensive', 'Cher'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='restaurants'
    )
    coordinates = gis_models.PointField(srid=4326, spatial_index=True)
    address = models.TextField()
    phone = PhoneNumberField(region='CI')
    cuisine_type = models.JSONField(
        default=list,
        help_text="Types de cuisine: ['ivoirienne', 'française', etc.]"
    )
    
    # Évaluations
    average_rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    rating_count = models.IntegerField(default=0)
    
    price_range = models.CharField(max_length=10, choices=PRICE_RANGES)
    opening_hours = models.JSONField(
        default=dict,
        help_text="Horaires d'ouverture par jour"
    )
    description = models.TextField(blank=True)
    photos = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'restaurants'
        verbose_name = 'Restaurant'
        verbose_name_plural = 'Restaurants'
        ordering = ['name']
        indexes = [
            models.Index(fields=['location', 'is_active']),
        ]

    def __str__(self):
        return self.name


class CarRental(TimeStampedModel):
    """Agences de location de voiture"""
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='car_rentals'
    )
    coordinates = gis_models.PointField(srid=4326, spatial_index=True)
    address = models.TextField()
    phone = PhoneNumberField(region='CI')
    email = models.EmailField()
    website = models.URLField(blank=True)
    
    # Évaluations
    average_rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    rating_count = models.IntegerField(default=0)
    
    # Prix et services
    price_per_day_fcfa = models.IntegerField(validators=[MinValueValidator(0)])
    car_types_available = models.JSONField(
        default=list,
        help_text="Types de voitures: ['sedan', 'suv', '4x4', etc.]"
    )
    amenities = models.JSONField(
        default=dict,
        help_text="Équipements: {gps: true, ac: true, etc.}"
    )
    insurance_included = models.BooleanField(default=False)
    unlimited_mileage = models.BooleanField(default=False)
    
    description = models.TextField(blank=True)
    photos = models.JSONField(default=list, blank=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'car_rentals'
        verbose_name = 'Agence de location'
        verbose_name_plural = 'Agences de location'
        ordering = ['name']
        indexes = [
            models.Index(fields=['location', 'is_active']),
        ]

    def __str__(self):
        return self.name


# ============================================================================
# DONNÉES POUR IA
# ============================================================================

class PriceHistory(TimeStampedModel):
    """Historique des prix pour analyse IA"""
    
    transport_mode = models.ForeignKey(
        TransportMode,
        on_delete=models.CASCADE,
        related_name='price_history'
    )
    origin = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='prices_from'
    )
    destination = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='prices_to'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    distance_km = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    recorded_at = models.DateTimeField(auto_now_add=True, db_index=True)
    source = models.CharField(
        max_length=50,
        help_text="Source de l'information (API, user_reported, etc.)"
    )

    class Meta:
        db_table = 'price_history'
        verbose_name = 'Historique de prix'
        verbose_name_plural = 'Historique des prix'
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['transport_mode', 'origin', 'destination']),
            models.Index(fields=['recorded_at']),
        ]

    def __str__(self):
        return f"{self.transport_mode.name}: {self.origin} → {self.destination} - {self.price} FCFA"


class TrafficData(TimeStampedModel):
    """Données de trafic pour améliorer les estimations"""
    
    TRAFFIC_LEVELS = [
        ('low', 'Fluide'),
        ('moderate', 'Modéré'),
        ('high', 'Dense'),
        ('very_high', 'Très dense'),
    ]
    
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='traffic_data'
    )
    coordinates = gis_models.PointField(srid=4326, spatial_index=True)
    traffic_level = models.CharField(max_length=20, choices=TRAFFIC_LEVELS)
    average_speed_kmh = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    recorded_at = models.DateTimeField(auto_now_add=True, db_index=True)
    day_of_week = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(6)],
        help_text="0=Lundi, 6=Dimanche"
    )
    hour_of_day = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(23)]
    )
    source = models.CharField(max_length=50)

    class Meta:
        db_table = 'traffic_data'
        verbose_name = 'Donnée de trafic'
        verbose_name_plural = 'Données de trafic'
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['day_of_week', 'hour_of_day']),
            models.Index(fields=['location', 'recorded_at']),
        ]

    def __str__(self):
        return f"{self.location.name} - {self.get_traffic_level_display()}"
