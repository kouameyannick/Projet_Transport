import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Location, TransportOption, POI } from '../data/abidjan-data';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface RouteMapProps {
  from: Location;
  to: Location;
  selectedOption?: TransportOption;
  hotels?: POI[];
  restaurants?: POI[];
  carRentals?: POI[];
}

// Composant pour ajuster la vue de la carte
function MapUpdater({ from, to, selectedOption }: { from: Location; to: Location; selectedOption?: TransportOption }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [from.lat, from.lng],
      [to.lat, to.lng]
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, from, to, selectedOption]);

  return null;
}

export default function RouteMap({ from, to, selectedOption, hotels, restaurants, carRentals }: RouteMapProps) {
  // Créer des icônes personnalisées
  const createCustomIcon = (color: string, emoji: string) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 18px;">${emoji}</div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  const startIcon = createCustomIcon('#FF6B35', '📍');
  const endIcon = createCustomIcon('#26A65B', '🎯');
  const hotelIcon = createCustomIcon('#4A90E2', '🏨');
  const restaurantIcon = createCustomIcon('#F7B731', '🍽️');
  const carIcon = createCustomIcon('#3498DB', '🚗');

  const center: [number, number] = [
    (from.lat + to.lat) / 2,
    (from.lng + to.lng) / 2,
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-[#FF6B35] p-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>🗺️</span>
          <span>Carte Interactive</span>
        </h3>
        {selectedOption && (
          <p className="text-white/90 text-sm mt-1">
            Itinéraire : {selectedOption.transportMode.name}
          </p>
        )}
      </div>

      <div className="h-[500px] relative">
        <MapContainer
          center={center}
          zoom={12}
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater from={from} to={to} selectedOption={selectedOption} />

          {/* Marqueur départ */}
          <Marker position={[from.lat, from.lng]} icon={startIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-[#FF6B35]">Départ</p>
                <p className="text-sm">{from.name}</p>
              </div>
            </Popup>
          </Marker>

          {/* Marqueur arrivée */}
          <Marker position={[to.lat, to.lng]} icon={endIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-[#26A65B]">Arrivée</p>
                <p className="text-sm">{to.name}</p>
              </div>
            </Popup>
          </Marker>

          {/* Itinéraire */}
          {selectedOption && selectedOption.route && (
            <Polyline
              positions={selectedOption.route}
              color={selectedOption.transportMode.color}
              weight={5}
              opacity={0.7}
            />
          )}

          {/* Hôtels */}
          {hotels?.map((hotel) => (
            <Marker key={hotel.id} position={[hotel.lat, hotel.lng]} icon={hotelIcon}>
              <Popup>
                <div className="min-w-[200px]">
                  <p className="font-bold text-[#4A90E2]">{hotel.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{hotel.address}</p>
                  {hotel.price && (
                    <p className="text-xs text-gray-700 mt-1">💰 {hotel.price}</p>
                  )}
                  {hotel.rating && (
                    <p className="text-xs text-gray-700">⭐ {hotel.rating}/5</p>
                  )}
                  {hotel.phone && (
                    <p className="text-xs text-gray-700">📞 {hotel.phone}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Restaurants */}
          {restaurants?.map((restaurant) => (
            <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lng]} icon={restaurantIcon}>
              <Popup>
                <div className="min-w-[200px]">
                  <p className="font-bold text-[#F7B731]">{restaurant.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{restaurant.address}</p>
                  {restaurant.rating && (
                    <p className="text-xs text-gray-700 mt-1">⭐ {restaurant.rating}/5</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Locations de voiture */}
          {carRentals?.map((rental) => (
            <Marker key={rental.id} position={[rental.lat, rental.lng]} icon={carIcon}>
              <Popup>
                <div className="min-w-[200px]">
                  <p className="font-bold text-[#3498DB]">{rental.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{rental.address}</p>
                  {rental.price && (
                    <p className="text-xs text-gray-700 mt-1">💰 {rental.price}</p>
                  )}
                  {rental.phone && (
                    <p className="text-xs text-gray-700">📞 {rental.phone}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Légende */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Légende:</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center space-x-1">
            <span>📍</span>
            <span className="text-gray-600">Départ</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🎯</span>
            <span className="text-gray-600">Arrivée</span>
          </div>
          {hotels && hotels.length > 0 && (
            <div className="flex items-center space-x-1">
              <span>🏨</span>
              <span className="text-gray-600">Hôtels</span>
            </div>
          )}
          {restaurants && restaurants.length > 0 && (
            <div className="flex items-center space-x-1">
              <span>🍽️</span>
              <span className="text-gray-600">Restaurants</span>
            </div>
          )}
          {carRentals && carRentals.length > 0 && (
            <div className="flex items-center space-x-1">
              <span>🚗</span>
              <span className="text-gray-600">Location de voiture</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
