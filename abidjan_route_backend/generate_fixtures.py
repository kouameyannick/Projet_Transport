"""
Script Python pour générer les fixtures (données initiales)
pour l'application Abidjan Route

Exécuter avec: python generate_fixtures.py
Puis charger avec: python manage.py loaddata initial_data.json
"""

import json
import uuid
from datetime import time

# ============================================================================
# LOCATIONS (Communes et Quartiers d'Abidjan)
# ============================================================================

locations = [
    # Communes
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Abobo",
            "slug": "abobo",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-4.0167 5.4147)",
            "population": 1200000,
            "description": "Commune populaire du nord d'Abidjan",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Adjamé",
            "slug": "adjame",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-4.0167 5.3500)",
            "population": 500000,
            "description": "Centre commercial et de transport d'Abidjan",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Cocody",
            "slug": "cocody",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-3.9833 5.3500)",
            "population": 400000,
            "description": "Quartier résidentiel huppé",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Plateau",
            "slug": "plateau",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-4.0000 5.3167)",
            "population": 50000,
            "description": "Centre des affaires d'Abidjan",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Yopougon",
            "slug": "yopougon",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-4.0833 5.3333)",
            "population": 1500000,
            "description": "La plus grande commune d'Abidjan",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Marcory",
            "slug": "marcory",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-3.9833 5.2833)",
            "population": 300000,
            "description": "Zone résidentielle et commerciale",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Treichville",
            "slug": "treichville",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-4.0000 5.3000)",
            "population": 150000,
            "description": "Quartier animé avec le port",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Koumassi",
            "slug": "koumassi",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-3.9500 5.3000)",
            "population": 400000,
            "description": "Zone industrielle et résidentielle",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Port-Bouët",
            "slug": "port-bouet",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-3.9167 5.2667)",
            "population": 300000,
            "description": "Abrite l'aéroport international",
            "is_active": True
        }
    },
    {
        "model": "core.location",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Attécoubé",
            "slug": "attecoube",
            "type": "commune",
            "parent_location": None,
            "coordinates": "POINT(-4.0333 5.3333)",
            "population": 300000,
            "description": "Commune résidentielle",
            "is_active": True
        }
    },
]

# ============================================================================
# TRANSPORT MODES
# ============================================================================

transport_modes = [
    {
        "model": "transport.transportmode",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Bus SOTRA",
            "slug": "sotra",
            "type": "bus",
            "icon": "🚌",
            "color": "#FF6B35",
            "description": "Société des Transports Abidjanais - Bus publics",
            "base_price": 200,
            "price_per_km": 0,
            "average_speed": 25,
            "comfort_rating": 3,
            "security_rating": 4,
            "operating_hours_start": "05:00:00",
            "operating_hours_end": "22:00:00",
            "is_active": True
        }
    },
    {
        "model": "transport.transportmode",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Yango Taxi",
            "slug": "yango",
            "type": "taxi",
            "icon": "🚕",
            "color": "#4A90E2",
            "description": "Service de taxi à la demande",
            "base_price": 1000,
            "price_per_km": 400,
            "average_speed": 35,
            "comfort_rating": 5,
            "security_rating": 5,
            "operating_hours_start": "00:00:00",
            "operating_hours_end": "23:59:59",
            "is_active": True
        }
    },
    {
        "model": "transport.transportmode",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Gbaka",
            "slug": "gbaka",
            "type": "gbaka",
            "icon": "🚐",
            "color": "#F7B731",
            "description": "Minibus collectifs",
            "base_price": 150,
            "price_per_km": 0,
            "average_speed": 20,
            "comfort_rating": 2,
            "security_rating": 3,
            "operating_hours_start": "05:00:00",
            "operating_hours_end": "23:00:00",
            "is_active": True
        }
    },
    {
        "model": "transport.transportmode",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Woro-Woro",
            "slug": "woro",
            "type": "woro",
            "icon": "🏍️",
            "color": "#26A65B",
            "description": "Taxi-motos rapides",
            "base_price": 500,
            "price_per_km": 300,
            "average_speed": 40,
            "comfort_rating": 3,
            "security_rating": 3,
            "operating_hours_start": "06:00:00",
            "operating_hours_end": "20:00:00",
            "is_active": True
        }
    },
    {
        "model": "transport.transportmode",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Train",
            "slug": "train",
            "type": "train",
            "icon": "🚆",
            "color": "#8E44AD",
            "description": "Train urbain",
            "base_price": 400,
            "price_per_km": 0,
            "average_speed": 50,
            "comfort_rating": 4,
            "security_rating": 4,
            "operating_hours_start": "06:00:00",
            "operating_hours_end": "21:00:00",
            "is_active": True
        }
    },
    {
        "model": "transport.transportmode",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Métro",
            "slug": "metro",
            "type": "metro",
            "icon": "🚇",
            "color": "#E74C3C",
            "description": "Métro d'Abidjan (en construction)",
            "base_price": 300,
            "price_per_km": 0,
            "average_speed": 60,
            "comfort_rating": 5,
            "security_rating": 5,
            "operating_hours_start": "05:30:00",
            "operating_hours_end": "23:30:00",
            "is_active": False
        }
    },
    {
        "model": "transport.transportmode",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Location de voiture",
            "slug": "location",
            "type": "car_rental",
            "icon": "🚗",
            "color": "#3498DB",
            "description": "Location de véhicule privé",
            "base_price": 5000,
            "price_per_km": 500,
            "average_speed": 40,
            "comfort_rating": 5,
            "security_rating": 5,
            "operating_hours_start": "08:00:00",
            "operating_hours_end": "18:00:00",
            "is_active": True
        }
    }
]

# ============================================================================
# HOTELS
# ============================================================================

hotels = [
    {
        "model": "pois.hotel",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Hôtel Ivoire",
            "slug": "hotel-ivoire",
            "coordinates": "POINT(-4.0000 5.3167)",
            "address": "Boulevard Hassan II, Cocody",
            "phone": "+22527224800",
            "email": "contact@hotel-ivoire.ci",
            "website": "https://www.sofitelabidjan.com",
            "star_rating": 5,
            "average_rating": 4.5,
            "rating_count": 0,
            "price_range": "luxury",
            "min_price_fcfa": 50000,
            "max_price_fcfa": 150000,
            "amenities": {
                "wifi": True,
                "pool": True,
                "restaurant": True,
                "bar": True,
                "spa": True,
                "gym": True,
                "parking": True,
                "casino": True
            },
            "description": "Hôtel 5 étoiles emblématique d'Abidjan",
            "photos": [],
            "is_verified": True,
            "is_active": True
        }
    },
    {
        "model": "pois.hotel",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Pullman Abidjan",
            "slug": "pullman-abidjan",
            "coordinates": "POINT(-4.0050 5.3200)",
            "address": "Rue Émile Boga Doudou, Plateau",
            "phone": "+22527202550",
            "email": "contact@pullman-abidjan.com",
            "website": "https://www.pullmanhotels.com",
            "star_rating": 5,
            "average_rating": 4.8,
            "rating_count": 0,
            "price_range": "luxury",
            "min_price_fcfa": 60000,
            "max_price_fcfa": 200000,
            "amenities": {
                "wifi": True,
                "pool": True,
                "restaurant": True,
                "bar": True,
                "spa": True,
                "gym": True,
                "parking": True,
                "business_center": True
            },
            "description": "Hôtel d'affaires moderne au cœur du Plateau",
            "photos": [],
            "is_verified": True,
            "is_active": True
        }
    }
]

# ============================================================================
# CAR RENTALS
# ============================================================================

car_rentals = [
    {
        "model": "pois.carrental",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Europcar Abidjan",
            "slug": "europcar-abidjan",
            "coordinates": "POINT(-4.0020 5.3170)",
            "address": "Avenue Terrasson de Fougères, Plateau",
            "phone": "+22527202200",
            "email": "abidjan@europcar.ci",
            "website": "https://www.europcar.ci",
            "average_rating": 4.2,
            "rating_count": 0,
            "price_per_day_fcfa": 25000,
            "car_types_available": ["sedan", "suv", "4x4", "minibus"],
            "amenities": {
                "gps": True,
                "ac": True,
                "automatic": True,
                "bluetooth": True
            },
            "insurance_included": True,
            "unlimited_mileage": False,
            "description": "Location de véhicules de qualité européenne",
            "photos": [],
            "is_verified": True,
            "is_active": True
        }
    },
    {
        "model": "pois.carrental",
        "pk": str(uuid.uuid4()),
        "fields": {
            "name": "Hertz Côte d'Ivoire",
            "slug": "hertz-ci",
            "coordinates": "POINT(-3.9180 5.2680)",
            "address": "Aéroport International Félix Houphouët-Boigny",
            "phone": "+22527212787",
            "email": "abidjan@hertz.ci",
            "website": "https://www.hertz.ci",
            "average_rating": 4.5,
            "rating_count": 0,
            "price_per_day_fcfa": 30000,
            "car_types_available": ["economy", "sedan", "suv", "luxury"],
            "amenities": {
                "gps": True,
                "ac": True,
                "automatic": True,
                "child_seat": True,
                "bluetooth": True
            },
            "insurance_included": True,
            "unlimited_mileage": True,
            "description": "Leader mondial de la location de voitures",
            "photos": [],
            "is_verified": True,
            "is_active": True
        }
    }
]

# ============================================================================
# GÉNÉRER LE FICHIER JSON
# ============================================================================

def generate_fixtures():
    """Génère le fichier fixtures complet"""
    
    all_fixtures = []
    all_fixtures.extend(locations)
    all_fixtures.extend(transport_modes)
    all_fixtures.extend(hotels)
    all_fixtures.extend(car_rentals)
    
    with open('initial_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_fixtures, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Fichier initial_data.json créé avec succès!")
    print(f"   - {len(locations)} locations")
    print(f"   - {len(transport_modes)} modes de transport")
    print(f"   - {len(hotels)} hôtels")
    print(f"   - {len(car_rentals)} agences de location")
    print(f"\nPour charger les données:")
    print(f"   python manage.py loaddata initial_data.json")

if __name__ == "__main__":
    generate_fixtures()
