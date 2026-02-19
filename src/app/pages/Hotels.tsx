import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Star, Phone, MapPin } from 'lucide-react';
import { hotelsPOIs, POI, allLocations, Location } from '../data/abidjan-data';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Hotels() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHotels, setFilteredHotels] = useState<POI[]>(hotelsPOIs);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') {
      setFilteredHotels(hotelsPOIs);
      setSelectedLocation(null);
      return;
    }

    // Rechercher par nom d'hôtel ou par lieu
    const byHotelName = hotelsPOIs.filter(hotel =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Rechercher par lieu
    const location = allLocations.find(loc =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (location) {
      setSelectedLocation(location);
      // Dans un vrai système, on filtrerait par proximité
      setFilteredHotels(hotelsPOIs);
    } else {
      setFilteredHotels(byHotelName);
      setSelectedLocation(null);
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Icône personnalisée pour les hôtels
  const hotelIcon = L.divIcon({
    html: '<div style="background-color: #4A90E2; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 18px;">🏨</div>',
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  const center: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng]
    : [5.32, -4.01];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Header */}
       {/* <div
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1690975719788-c0cf5b5692de?w=1200)",
        }}
      > */}
      <div className="bg-[#045C11] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            Trouvez votre hôtel à Abidjan
          </h1>
          <p className="text-xl text-white/90">
            Explorez les meilleurs établissements de la ville
          </p>
        </div>
      </div>

      {/* Formulaire de recherche */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Rechercher un hôtel ou un quartier (ex: Cocody, Plateau...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-8 bg-[#045C11] hover:bg-[#0B701B]"
            >
              <Search className="h-5 w-5 mr-2" />
              Rechercher
            </Button>
          </div>
        </form>
      </div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Liste des hôtels */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {filteredHotels.length} hôtel{filteredHotels.length > 1 ? 's' : ''} trouvé{filteredHotels.length > 1 ? 's' : ''}
            </h2>
            
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                    {renderStars(hotel.rating)}
                  </div>
                  <div className="text-2xl">🏨</div>
                </div>

                {hotel.address && (
                  <div className="flex items-start space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{hotel.address}</p>
                  </div>
                )}

                {hotel.phone && (
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <Phone className="h-5 w-5" />
                    <p className="text-sm">{hotel.phone}</p>
                  </div>
                )}

                {hotel.price && (
                  <div className="bg-green-50 px-4 py-2 rounded-lg inline-block">
                    <p className="text-green-700 font-medium">{hotel.price}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Carte */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-20 h-[600px]">
            <div className="bg-[#045C11] p-4">
              <h3 className="text-xl font-bold text-white">Carte des hôtels</h3>
            </div>
            <MapContainer
              center={center}
              zoom={13}
              className="h-[calc(100%-60px)] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredHotels.map((hotel) => (
                <Marker
                  key={hotel.id}
                  position={[hotel.lat, hotel.lng]}
                  icon={hotelIcon}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <p className="font-bold text-[#4A90E2]">{hotel.name}</p>
                      {renderStars(hotel.rating)}
                      <p className="text-xs text-gray-600 mt-1">{hotel.address}</p>
                      {hotel.price && (
                        <p className="text-xs text-gray-700 mt-1">💰 {hotel.price}</p>
                      )}
                      {hotel.phone && (
                        <p className="text-xs text-gray-700">📞 {hotel.phone}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
