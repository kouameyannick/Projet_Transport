import { useState } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { allLocations, Location } from '../data/abidjan-data';

interface SearchFormProps {
  onSearch: (from: Location, to: Location) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<Location[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Location[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<Location | null>(null);
  const [selectedTo, setSelectedTo] = useState<Location | null>(null);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const handleFromChange = (value: string) => {
    setFromQuery(value);
    setSelectedFrom(null);
    if (value.length > 0) {
      const filtered = allLocations.filter(loc =>
        loc.name.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered);
      setShowFromSuggestions(true);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  const handleToChange = (value: string) => {
    setToQuery(value);
    setSelectedTo(null);
    if (value.length > 0) {
      const filtered = allLocations.filter(loc =>
        loc.name.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered);
      setShowToSuggestions(true);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const selectFromLocation = (location: Location) => {
    setSelectedFrom(location);
    setFromQuery(location.name);
    setShowFromSuggestions(false);
  };

  const selectToLocation = (location: Location) => {
    setSelectedTo(location);
    setToQuery(location.name);
    setShowToSuggestions(false);
  };

  const handleUseMyLocation = () => {
    // Simuler la géolocalisation
    const abobo = allLocations.find(loc => loc.id === 'abobo');
    if (abobo) {
      selectFromLocation(abobo);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFrom && selectedTo) {
      onSearch(selectedFrom, selectedTo);
    }
  };

  const swapLocations = () => {
    const tempQuery = fromQuery;
    const tempSelected = selectedFrom;
    setFromQuery(toQuery);
    setSelectedFrom(selectedTo);
    setToQuery(tempQuery);
    setSelectedTo(tempSelected);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Planifiez votre trajet
      </h2>

      {/* Départ */}
      <div className="relative">
        <Label htmlFor="from" className="text-gray-700 mb-2 block">
          Point de départ
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FF6B35]" />
          <Input
            id="from"
            type="text"
            placeholder="Ex: Abobo, Abobo Gendarmerie..."
            value={fromQuery}
            onChange={(e) => handleFromChange(e.target.value)}
            onFocus={() => fromSuggestions.length > 0 && setShowFromSuggestions(true)}
            className="pl-10 pr-10 h-12 text-lg border-2 border-gray-200 focus:border-[#FF6B35]"
          />
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A90E2] hover:text-[#3A7BC8]"
            title="Utiliser ma position"
          >
            <Navigation className="h-5 w-5" />
          </button>
        </div>

        {/* Suggestions Départ */}
        {showFromSuggestions && fromSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {fromSuggestions.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => selectFromLocation(location)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-[#FF6B35]" />
                  <div>
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.type === 'commune' ? 'Commune' : `Quartier - ${location.commune}`}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bouton d'échange */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={swapLocations}
          className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          title="Échanger départ et arrivée"
        >
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Arrivée */}
      <div className="relative">
        <Label htmlFor="to" className="text-gray-700 mb-2 block">
          Point d'arrivée
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#26A65B]" />
          <Input
            id="to"
            type="text"
            placeholder="Ex: Adjamé, Yopougon..."
            value={toQuery}
            onChange={(e) => handleToChange(e.target.value)}
            onFocus={() => toSuggestions.length > 0 && setShowToSuggestions(true)}
            className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-[#26A65B]"
          />
        </div>

        {/* Suggestions Arrivée */}
        {showToSuggestions && toSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {toSuggestions.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => selectToLocation(location)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-[#26A65B]" />
                  <div>
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.type === 'commune' ? 'Commune' : `Quartier - ${location.commune}`}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bouton de recherche */}
      <Button
        type="submit"
        disabled={!selectedFrom || !selectedTo}
        className="w-full h-12 text-lg bg-[#E55A24] hover:bg-[#045C11] text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Search className="h-5 w-5 mr-2" />
        Rechercher un itinéraire
      </Button>
    </form>
  );
}
