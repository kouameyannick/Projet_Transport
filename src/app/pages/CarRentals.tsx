import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Star, Phone, MapPin, DollarSign } from 'lucide-react';
import { carRentalsPOIs, POI, allLocations, Location } from '../data/abidjan-data';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function CarRentals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRentals, setFilteredRentals] = useState<POI[]>(carRentalsPOIs);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') {
      setFilteredRentals(carRentalsPOIs);
      setSelectedLocation(null);
      return;
    }

    // Rechercher par nom d'agence ou par lieu
    const byName = carRentalsPOIs.filter(rental =>
      rental.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Rechercher par lieu
    const location = allLocations.find(loc =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (location) {
      setSelectedLocation(location);
      setFilteredRentals(carRentalsPOIs);
    } else {
      setFilteredRentals(byName);
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

  // Icône personnalisée
  const carIcon = L.divIcon({
    html: '<div style="background-color: #3498DB; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 18px;">🚗</div>',
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  const center: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng]
    : [5.32, -4.01];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Header */}
      <div className="bg-[#0168ef] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            Location de voiture à Abidjan
          </h1>
          <p className="text-xl text-white/90">
            Découvrez nos partenaires de confiance
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
                placeholder="Rechercher une agence ou un quartier (ex: Plateau, Cocody...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-8 bg-[#3498DB] hover:bg-[#2980B9]"
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
          {/* Liste des agences */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {filteredRentals.length} agence{filteredRentals.length > 1 ? 's' : ''} trouvée{filteredRentals.length > 1 ? 's' : ''}
            </h2>
            
            {filteredRentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{rental.name}</h3>
                    {renderStars(rental.rating)}
                  </div>
                  <div className="text-2xl">🚗</div>
                </div>

                {rental.address && (
                  <div className="flex items-start space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{rental.address}</p>
                  </div>
                )}

                {rental.phone && (
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <Phone className="h-5 w-5" />
                    <p className="text-sm">{rental.phone}</p>
                  </div>
                )}

                {rental.price && (
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <p className="text-blue-700 font-medium">{rental.price}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    ✓ Assurance incluse • ✓ Kilométrage illimité • ✓ Support 24/7
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Carte */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-20 h-[600px]">
            <div className="bg-[#3498DB] p-4">
              <h3 className="text-xl font-bold text-white">Carte des agences</h3>
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

              {filteredRentals.map((rental) => (
                <Marker
                  key={rental.id}
                  position={[rental.lat, rental.lng]}
                  icon={carIcon}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <p className="font-bold text-[#3498DB]">{rental.name}</p>
                      {renderStars(rental.rating)}
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
        </div>
      </div>

      {/* Info section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-[#3498DB] to-[#2980B9] rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Pourquoi louer une voiture ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🗺️</div>
              <h3 className="font-bold mb-2">Liberté totale</h3>
              <p className="text-white/90 text-sm">
                Explorez Abidjan à votre rythme sans contraintes d'horaires
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold mb-2">Prix compétitifs</h3>
              <p className="text-white/90 text-sm">
                Tarifs avantageux à partir de 22 000 FCFA par jour
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-bold mb-2">Sécurité garantie</h3>
              <p className="text-white/90 text-sm">
                Véhicules récents, bien entretenus avec assurance complète
              </p>
            </div>
          </div>
        </div>
      </div>

            {/* Footer */}
      <footer className="bg-black text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white-400">
            © 2026 Abidjan Route - Planification intelligente de déplacements
          </p>
          
        </div>
      </footer>
    </div>
  );
}
