import { useState } from 'react';
import Navbar from '../components/Navbar';
import SearchForm from '../components/SearchForm';
import TransportOptions from '../components/TransportOptions';
import RouteMap from '../components/RouteMap';
import { Button } from '../components/ui/button';
import { Location, TransportOption, generateTransportOptions, recommendRoute, hotelsPOIs, restaurantsPOIs } from '../data/abidjan-data';
import { Sparkles, Zap, DollarSign, Shield, TrendingUp,MapPin,Users,Clock } from 'lucide-react';

export default function Home() {
  const [searchResult, setSearchResult] = useState<{
    from: Location;
    to: Location;
    options: TransportOption[];
    recommendedId: string;
  } | null>(null);
  
  const [selectedOption, setSelectedOption] = useState<TransportOption | undefined>();
  const [aiCriteria, setAiCriteria] = useState<'fastest' | 'cheapest' | 'balanced' | 'safest'>('balanced');

  const handleSearch = (from: Location, to: Location) => {
    const options = generateTransportOptions(from, to);
    const recommendedId = recommendRoute(options, aiCriteria);
    
    setSearchResult({
      from,
      to,
      options,
      recommendedId,
    });
    
    // Sélectionner automatiquement l'option recommandée
    const recommended = options.find(opt => opt.id === recommendedId);
    setSelectedOption(recommended);

    // Scroll vers les résultats
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectOption = (option: TransportOption) => {
    setSelectedOption(option);
  };

  const handleCriteriaChange = (criteria: 'fastest' | 'cheapest' | 'balanced' | 'safest') => {
    setAiCriteria(criteria);
    if (searchResult) {
      const newRecommendedId = recommendRoute(searchResult.options, criteria);
      setSearchResult({
        ...searchResult,
        recommendedId: newRecommendedId,
      });
      
      // Sélectionner la nouvelle recommandation
      const newRecommended = searchResult.options.find(opt => opt.id === newRecommendedId);
      setSelectedOption(newRecommended);
    }
  };

  // Filtrer les POIs proches de la destination
  const nearbyHotels = searchResult ? hotelsPOIs.slice(0, 3) : [];
  const nearbyRestaurants = searchResult ? restaurantsPOIs : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <Navbar />

      {/* Hero Section */}
        <div
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1690975719788-c0cf5b5692de?w=1200)",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Planifiez vos déplacements à Abidjan
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Trouvez le meilleur itinéraire avec l'intelligence artificielle. 
            Comparez les prix, durées et options de transport en temps réel.
          </p>
        </div>
        </div>
      

      {/* Formulaire de recherche */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-8 ml-32"> */}

      <div className="max-w-7xl mx-auto px-4 mt-8" > 
        <div className="lg:col-span-2">
          <SearchForm onSearch={handleSearch} />
        </div>
                  {/* Quick Stats */}
          {/* <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6 w-64">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MapPin className="size-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">12+</p>
                  <p className="text-sm text-gray-600">Villes couvertes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 w-64">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">24/7</p>
                  <p className="text-sm text-gray-600">Service disponible</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 w-64">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">100%</p>
                  <p className="text-sm text-gray-600">Transparence des prix</p>
                </div>
              </div>
            </div>
          </div> */}
      </div>




      {/* Résultats */}
      {searchResult && (
        <div id="results" className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          {/* Critères IA */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-[#FF6B35]" />
              <h3 className="text-xl font-bold text-gray-900">
                Recommandation Intelligente
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Notre IA analyse tous les itinéraires selon vos préférences :
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant={aiCriteria === 'fastest' ? 'default' : 'outline'}
                className={aiCriteria === 'fastest' ? 'bg-[#4A90E2]' : ''}
                onClick={() => handleCriteriaChange('fastest')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Plus rapide
              </Button>
              <Button
                variant={aiCriteria === 'cheapest' ? 'default' : 'outline'}
                className={aiCriteria === 'cheapest' ? 'bg-[#26A65B]' : ''}
                onClick={() => handleCriteriaChange('cheapest')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Moins cher
              </Button>
              <Button
                variant={aiCriteria === 'balanced' ? 'default' : 'outline'}
                className={aiCriteria === 'balanced' ? 'bg-[#F7B731]' : ''}
                onClick={() => handleCriteriaChange('balanced')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Équilibré
              </Button>
              <Button
                variant={aiCriteria === 'safest' ? 'default' : 'outline'}
                className={aiCriteria === 'safest' ? 'bg-[#E74C3C]' : ''}
                onClick={() => handleCriteriaChange('safest')}
              >
                <Shield className="h-4 w-4 mr-2" />
                Plus sécurisé
              </Button>
            </div>
          </div>

          {/* Options de transport */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <TransportOptions
              options={searchResult.options}
              recommendedId={searchResult.recommendedId}
              onSelectOption={handleSelectOption}
              selectedOptionId={selectedOption?.id}
            />
          </div>

          {/* Carte */}
          <RouteMap
            from={searchResult.from}
            to={searchResult.to}
            selectedOption={selectedOption}
            hotels={nearbyHotels}
            restaurants={nearbyRestaurants}
          />
        </div>
      )}

      {/* Section info si pas de recherche */}
      {/* {!searchResult && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rapide</h3>
              <p className="text-gray-600">
                Trouvez le meilleur itinéraire en quelques secondes avec notre IA
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Économique</h3>
              <p className="text-gray-600">
                Comparez tous les prix et choisissez l'option la plus abordable
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sécurisé</h3>
              <p className="text-gray-600">
                Toutes nos options sont évaluées pour votre sécurité et confort
              </p>
            </div>
          </div>
        </div>
      )} */}

              {/* Features Section */}
        {!searchResult && (
          <div className="mt-12">
            <h2 className="text-3xl text-center text-gray-800 mb-8">
              Pourquoi choisir Abidjan Route ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Couverture complète
                </h3>
                <p className="text-gray-600">
                  Tous les modes de transport disponibles : bus, taxi, train, location de voiture
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Clock className="size-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Temps réel
                </h3>
                <p className="text-gray-600">
                  Informations actualisées sur les horaires, tarifs et disponibilités
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  IA intelligente
                </h3>
                <p className="text-gray-600">
                  Recommandations personnalisées pour trouver le meilleur itinéraire
                </p>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <MapPin className="size-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Itinéraires Multiples
                </h3>
                <p className="text-gray-600">
                Comparez tous les moyens de transport disponibles
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Pour tous
                </h3>
                <p className="text-gray-600">
                  Adapté aux voyageurs urbains et interurbains
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <DollarSign className="size-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Prix Transparents
                </h3>
                <p className="text-gray-600">
                  Estimations précises des coûts de transport
                </p>
              </div>
            </div>
          </div>
        )}
              {/* Features Section */}
      <div className="py-16 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Moyens de transport disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* <Sparkles className="w-8 h-8 text-orange-600" /> */}
                <img 
                    src="cd../assets/ai-icon.png" 
                    alt="Description" 
                    className="w-10 h-10 object-contain" 
                  />
              </div>
              <h3 className="text-xl font-semibold mb-2">IA Intelligente</h3>
              <p className="text-gray-600">
                Recommandations personnalisées basées sur vos besoins
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Itinéraires Multiples</h3>
              <p className="text-gray-600">
                Comparez tous les moyens de transport disponibles
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prix Transparents</h3>
              <p className="text-gray-600">
                Estimations précises des coûts de transport
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pour tous</h3>
              <p className="text-gray-600">
                Adapté aux voyageurs urbains et interurbains
              </p>
            </div>
          </div>
        </div>
      </div>

            {/* Transport Types */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Moyens de transport disponibles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { name: "Bus", icon: "🚌" },
              { name: "Taxi", icon: "🚕" },
              { name: "Woro-woro", icon: "🚖" },
              { name: "Train", icon: "🚆" },
              { name: "Gbaka", icon: "🚐" },
              { name: "Yango", icon: "📱" },
              { name: "Location", icon: "🚗" },
            ].map((transport) => (
              <div
                key={transport.name}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-2">{transport.icon}</div>
                <p className="font-medium text-gray-800">{transport.name}</p>
              </div>
            ))}
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
