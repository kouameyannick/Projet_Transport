import { useState } from 'react';
import { Clock, DollarSign, Navigation2, Star, Shield, Armchair, MapPin } from 'lucide-react';
import { TransportOption } from '../data/abidjan-data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface TransportOptionsProps {
  options: TransportOption[];
  recommendedId: string;
  onSelectOption: (option: TransportOption) => void;
  selectedOptionId?: string;
}

export default function TransportOptions({
  options,
  recommendedId,
  onSelectOption,
  selectedOptionId,
}: TransportOptionsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins} min`;
  };

  const formatDistance = (km: number) => {
    return `${km} km`;
  };

  const renderStars = (rating: number) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Options de transport</h3>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
          <span className="text-green-700 text-sm">✨ IA Recommandation</span>
        </div>
      </div>

      <div className="grid gap-4">
        {options.map((option) => {
          const isRecommended = option.id === recommendedId;
          const isSelected = option.id === selectedOptionId;

          return (
            <div
              key={option.id}
              className={`relative bg-white rounded-xl p-5 border-2 transition-all cursor-pointer hover:shadow-lg ${
                isSelected
                  ? 'border-[#FF6B35] shadow-lg'
                  : isRecommended
                  ? 'border-green-400'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectOption(option)}
            >
              {/* Badge Recommandé */}
              {isRecommended && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    ⭐ Recommandé par IA
                  </Badge>
                </div>
              )}

              <div className="flex items-start justify-between">
                {/* Infos transport */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: option.transportMode.color + '20' }}
                    >
                      {option.transportMode.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {option.transportMode.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {option.nearestStop}
                        {option.nearestStopDistance !== undefined && option.nearestStopDistance > 0 && (
                          <span className="ml-1">
                            ({option.nearestStopDistance}m)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Prix</p>
                        <p className="font-bold text-gray-900">{formatPrice(option.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Durée</p>
                        <p className="font-bold text-gray-900">{formatDuration(option.duration)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Navigation2 className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="font-bold text-gray-900">{formatDistance(option.distance)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-xs text-gray-500">Sécurité</p>
                        <div className="flex items-center">
                          {renderStars(option.securityRating)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrêts */}
                  {option.stops && option.stops.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-600 mb-2 flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Arrêts principaux:</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.stops.map((stop, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                          >
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confort */}
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Armchair className="h-4 w-4" />
                      <span>Confort:</span>
                      {renderStars(option.comfortRating)}
                    </div>
                  </div>
                </div>

                {/* Bouton voir itinéraire */}
                <div className="ml-4">
                  <Button
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                    className={
                      isSelected
                        ? 'bg-[#FF6B35] hover:bg-[#E55A24]'
                        : 'border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white'
                    }
                  >
                    {isSelected ? 'Affiché' : 'Voir l\'itinéraire'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
