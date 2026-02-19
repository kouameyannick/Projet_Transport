import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F7B731] mb-4">
            404
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page non trouvée
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-[#FF6B35] to-[#F7B731] hover:from-[#E55A24] hover:to-[#E6A620]"
            >
              <Link to="/">
                <Home className="h-5 w-5 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
            >
              <Link to="javascript:history.back()">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Page précédente
              </Link>
            </Button>
          </div>

          <div className="mt-12 text-gray-500">
            <p className="text-sm">
              Besoin d'aide ? Retournez à l'accueil pour planifier votre itinéraire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
