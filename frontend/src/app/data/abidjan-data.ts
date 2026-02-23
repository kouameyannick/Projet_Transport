// Données pour les communes et quartiers d'Abidjan
export interface Location {
  id: string;
  name: string;
  type: 'commune' | 'quartier';
  commune?: string;
  lat: number;
  lng: number;
}

export interface TransportMode {
  id: string;
  name: string;
  type: 'bus' | 'taxi' | 'train' | 'metro' | 'gbaka' | 'woro' | 'car_rental';
  icon: string;
  color: string;
}

export interface TransportOption {
  id: string;
  transportMode: TransportMode;
  price: number;
  duration: number; // en minutes
  distance: number; // en km
  stops?: string[];
  nearestStop?: string;
  nearestStopDistance?: number; // en mètres
  securityRating: number; // 1-5
  comfortRating: number; // 1-5
  route?: [number, number][]; // coordonnées pour la carte
}

export interface RouteResult {
  from: Location;
  to: Location;
  options: TransportOption[];
  recommendedOption: string; // ID de l'option recommandée
  hotels?: POI[];
  restaurants?: POI[];
}

export interface POI {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'car_rental';
  lat: number;
  lng: number;
  rating?: number;
  price?: string;
  address?: string;
  phone?: string;
}

// Communes d'Abidjan
export const communes: Location[] = [
  { id: 'abobo', name: 'Abobo', type: 'commune', lat: 5.4147, lng: -4.0167 },
  { id: 'adjame', name: 'Adjamé', type: 'commune', lat: 5.3500, lng: -4.0167 },
  { id: 'attécoubé', name: 'Attécoubé', type: 'commune', lat: 5.3333, lng: -4.0333 },
  { id: 'cocody', name: 'Cocody', type: 'commune', lat: 5.3500, lng: -3.9833 },
  { id: 'koumassi', name: 'Koumassi', type: 'commune', lat: 5.3000, lng: -3.9500 },
  { id: 'marcory', name: 'Marcory', type: 'commune', lat: 5.2833, lng: -3.9833 },
  { id: 'plateau', name: 'Plateau', type: 'commune', lat: 5.3167, lng: -4.0000 },
  { id: 'port-bouet', name: 'Port-Bouët', type: 'commune', lat: 5.2667, lng: -3.9167 },
  { id: 'treichville', name: 'Treichville', type: 'commune', lat: 5.3000, lng: -4.0000 },
  { id: 'yopougon', name: 'Yopougon', type: 'commune', lat: 5.3333, lng: -4.0833 },
  { id: 'songon', name: 'Songon', type: 'commune', lat: 5.3167, lng: -4.2500 },
  { id: 'bingerville', name: 'Bingerville', type: 'commune', lat: 5.3583, lng: -3.8972 },
  { id: 'anyama', name: 'Anyama', type: 'commune', lat: 5.4950, lng: -4.0511 },
];

// Quartiers d'Abobo
export const aboboQuartiers: Location[] = [
  { id: 'abobo-gendarmerie', name: 'Abobo Gendarmerie', type: 'quartier', commune: 'abobo', lat: 5.4200, lng: -4.0200 },
  { id: 'abobo-ndotre', name: "Abobo N'Dotré", type: 'quartier', commune: 'abobo', lat: 5.4100, lng: -4.0100 },
  { id: 'abobo-pk18', name: 'Abobo PK18', type: 'quartier', commune: 'abobo', lat: 5.4250, lng: -4.0250 },
  { id: 'abobo-avocatier', name: 'Abobo Avocatier', type: 'quartier', commune: 'abobo', lat: 5.4180, lng: -4.0180 },
  { id: 'abobo-baoulé', name: 'Abobo Baoulé', type: 'quartier', commune: 'abobo', lat: 5.4120, lng: -4.0150 },
];

// Tous les lieux (communes + quartiers)
export const allLocations: Location[] = [...communes, ...aboboQuartiers];

// Moyens de transport
export const transportModes: TransportMode[] = [
  { id: 'sotra', name: 'Bus SOTRA', type: 'bus', icon: '🚌', color: '#FF6B35' },
  { id: 'yango', name: 'Yango Taxi', type: 'taxi', icon: '🚕', color: '#4A90E2' },
  { id: 'gbaka', name: 'Gbaka', type: 'gbaka', icon: '🚐', color: '#F7B731' },
  { id: 'woro', name: 'Woro-Woro', type: 'woro', icon: '🏍️', color: '#26A65B' },
  { id: 'train', name: 'Train', type: 'train', icon: '🚆', color: '#8E44AD' },
  { id: 'metro', name: 'Métro', type: 'metro', icon: '🚇', color: '#E74C3C' },
  { id: 'location', name: 'Location de voiture', type: 'car_rental', icon: '🚗', color: '#3498DB' },
];

// Fonction pour générer des options de transport mockées
export function generateTransportOptions(from: Location, to: Location): TransportOption[] {
  const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
  
  const options: TransportOption[] = [
    {
      id: 'opt-sotra',
      transportMode: transportModes[0],
      price: 200,
      duration: Math.round(distance * 6 + 20),
      distance: distance,
      stops: ['Arrêt ' + from.name, 'Adjamé Gare', 'Arrêt ' + to.name],
      nearestStop: 'Arrêt SOTRA ' + from.name,
      nearestStopDistance: 350,
      securityRating: 4,
      comfortRating: 3,
      route: generateRoute(from, to),
    },
    {
      id: 'opt-yango',
      transportMode: transportModes[1],
      price: Math.round(distance * 400 + 1000),
      duration: Math.round(distance * 3 + 10),
      distance: distance,
      nearestStop: 'Votre position',
      nearestStopDistance: 0,
      securityRating: 5,
      comfortRating: 5,
      route: generateRoute(from, to),
    },
    {
      id: 'opt-gbaka',
      transportMode: transportModes[2],
      price: 150,
      duration: Math.round(distance * 4 + 15),
      distance: distance,
      stops: ['Terminus ' + from.name, 'Gare routière', 'Terminus ' + to.name],
      nearestStop: 'Station Gbaka ' + from.name,
      nearestStopDistance: 280,
      securityRating: 3,
      comfortRating: 2,
      route: generateRoute(from, to),
    },
    {
      id: 'opt-woro',
      transportMode: transportModes[3],
      price: Math.round(distance * 300 + 500),
      duration: Math.round(distance * 2.5 + 8),
      distance: distance,
      nearestStop: 'Votre position',
      nearestStopDistance: 0,
      securityRating: 3,
      comfortRating: 3,
      route: generateRoute(from, to),
    },
  ];

  // Ajouter le train si la distance est > 10km
  if (distance > 10) {
    options.push({
      id: 'opt-train',
      transportMode: transportModes[4],
      price: 400,
      duration: Math.round(distance * 2 + 15),
      distance: distance,
      stops: ['Gare ' + from.name, 'Gare centrale', 'Gare ' + to.name],
      nearestStop: 'Gare de ' + from.name,
      nearestStopDistance: 800,
      securityRating: 4,
      comfortRating: 4,
      route: generateRoute(from, to),
    });
  }

  // Ajouter location de voiture
  options.push({
    id: 'opt-location',
    transportMode: transportModes[6],
    price: Math.round(distance * 500 + 5000),
    duration: Math.round(distance * 3 + 5),
    distance: distance,
    nearestStop: 'Agence de location',
    nearestStopDistance: 500,
    securityRating: 5,
    comfortRating: 5,
    route: generateRoute(from, to),
  });

  return options;
}

// Calcul de distance entre deux points (formule Haversine simplifiée)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Arrondir à 1 décimale
}

// Générer un itinéraire simplifié
function generateRoute(from: Location, to: Location): [number, number][] {
  const points: [number, number][] = [];
  const steps = 5;
  
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const lat = from.lat + (to.lat - from.lat) * ratio;
    const lng = from.lng + (to.lng - from.lng) * ratio;
    points.push([lat, lng]);
  }
  
  return points;
}

// Fonction pour recommander le meilleur itinéraire selon un critère
export function recommendRoute(options: TransportOption[], criteria: 'fastest' | 'cheapest' | 'balanced' | 'safest'): string {
  let bestOption = options[0];

  switch (criteria) {
    case 'fastest':
      options.forEach(opt => {
        if (opt.duration < bestOption.duration) bestOption = opt;
      });
      break;
    case 'cheapest':
      options.forEach(opt => {
        if (opt.price < bestOption.price) bestOption = opt;
      });
      break;
    case 'safest':
      options.forEach(opt => {
        if (opt.securityRating > bestOption.securityRating) bestOption = opt;
      });
      break;
    case 'balanced':
      // Score équilibré : normalisation et moyenne
      const maxPrice = Math.max(...options.map(o => o.price));
      const maxDuration = Math.max(...options.map(o => o.duration));
      
      options.forEach(opt => {
        const priceScore = 1 - (opt.price / maxPrice);
        const durationScore = 1 - (opt.duration / maxDuration);
        const securityScore = opt.securityRating / 5;
        const comfortScore = opt.comfortRating / 5;
        
        const currentScore = (priceScore + durationScore + securityScore + comfortScore) / 4;
        
        const bestPriceScore = 1 - (bestOption.price / maxPrice);
        const bestDurationScore = 1 - (bestOption.duration / maxDuration);
        const bestSecurityScore = bestOption.securityRating / 5;
        const bestComfortScore = bestOption.comfortRating / 5;
        
        const bestScore = (bestPriceScore + bestDurationScore + bestSecurityScore + bestComfortScore) / 4;
        
        if (currentScore > bestScore) bestOption = opt;
      });
      break;
  }

  return bestOption.id;
}

// POIs mockés
export const hotelsPOIs: POI[] = [
  { id: 'h1', name: 'Hôtel Ivoire', type: 'hotel', lat: 5.3167, lng: -4.0000, rating: 4.5, price: '25000-50000 FCFA', address: 'Boulevard Hassan II, Cocody', phone: '+225 27 22 48 00 00' },
  { id: 'h2', name: 'Pullman Abidjan', type: 'hotel', lat: 5.3200, lng: -4.0050, rating: 4.8, price: '40000-80000 FCFA', address: 'Rue Émile Boga Doudou, Plateau', phone: '+225 27 20 25 50 00' },
  { id: 'h3', name: 'Azalaï Hôtel', type: 'hotel', lat: 5.3300, lng: -4.0100, rating: 4.2, price: '20000-40000 FCFA', address: 'Boulevard Valéry Giscard d\'Estaing', phone: '+225 27 22 47 73 73' },
  { id: 'h4', name: 'Hôtel Tiama', type: 'hotel', lat: 5.3150, lng: -3.9900, rating: 4.0, price: '15000-30000 FCFA', address: 'Rue des Jardins, Plateau', phone: '+225 27 20 33 28 00' },
  { id: 'h5', name: 'Onomo Hotel', type: 'hotel', lat: 5.2700, lng: -3.9200, rating: 4.3, price: '18000-35000 FCFA', address: 'Aéroport Félix Houphouët-Boigny', phone: '+225 27 21 27 88 88' },
];

export const restaurantsPOIs: POI[] = [
  { id: 'r1', name: 'La Terrasse', type: 'restaurant', lat: 5.3180, lng: -4.0020, rating: 4.6, address: 'Plateau' },
  { id: 'r2', name: 'Chez Amina', type: 'restaurant', lat: 5.3220, lng: -4.0080, rating: 4.4, address: 'Cocody' },
  { id: 'r3', name: 'Le Toit d\'Abidjan', type: 'restaurant', lat: 5.3190, lng: -4.0010, rating: 4.7, address: 'Plateau' },
];

export const carRentalsPOIs: POI[] = [
  { id: 'c1', name: 'Europcar Abidjan', type: 'car_rental', lat: 5.3170, lng: -4.0020, rating: 4.2, price: '25000 FCFA/jour', address: 'Avenue Terrasson de Fougères, Plateau', phone: '+225 27 20 22 00 00' },
  { id: 'c2', name: 'Hertz Côte d\'Ivoire', type: 'car_rental', lat: 5.2680, lng: -3.9180, rating: 4.5, price: '30000 FCFA/jour', address: 'Aéroport International, Port-Bouët', phone: '+225 27 21 27 87 87' },
  { id: 'c3', name: 'Avis Location', type: 'car_rental', lat: 5.3200, lng: -4.0100, rating: 4.3, price: '28000 FCFA/jour', address: 'Boulevard de la République, Plateau', phone: '+225 27 20 31 61 61' },
  { id: 'c4', name: 'Budget Rent a Car', type: 'car_rental', lat: 5.3150, lng: -3.9950, rating: 4.0, price: '22000 FCFA/jour', address: 'Rue du Commerce, Plateau', phone: '+225 27 20 30 40 40' },
  { id: 'c5', name: 'Sixt Abidjan', type: 'car_rental', lat: 5.3350, lng: -3.9850, rating: 4.4, price: '27000 FCFA/jour', address: 'Boulevard Latrille, Cocody', phone: '+225 27 22 41 50 50' },
];
