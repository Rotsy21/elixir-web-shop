
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "@/data/mockData";
import { Product } from "@/models/types";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight, Droplets, Coffee, Wine } from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts();
        setFeaturedProducts(products.filter(p => p.featured).slice(0, 4));
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in">
                Rafraîchissez-vous avec nos boissons d'exception
              </h1>
              <p className="mt-4 text-xl text-gray-600 animate-fade-in" style={{animationDelay: "0.1s"}}>
                Découvrez notre sélection de boissons premium pour tous les moments de votre journée.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{animationDelay: "0.2s"}}>
                <Button size="lg" onClick={() => navigate("/products")}>
                  Découvrir nos produits <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
                  À propos de nous
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative animate-float">
                <img
                  src="/placeholder.svg"
                  alt="Elixir Drinks"
                  className="mx-auto w-full max-w-md rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Nos catégories de boissons</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              De l'eau pure aux sodas pétillants, en passant par nos thés et jus artisanaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {/* Category 1 */}
            <div className="bg-blue-50 rounded-lg p-8 text-center transition-transform hover:scale-105 cursor-pointer" onClick={() => navigate("/products")}>
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eaux et boissons légères</h3>
              <p className="text-gray-600">Eaux minérales, eaux pétillantes et boissons peu sucrées</p>
            </div>

            {/* Category 2 */}
            <div className="bg-amber-50 rounded-lg p-8 text-center transition-transform hover:scale-105 cursor-pointer" onClick={() => navigate("/products")}>
              <div className="inline-block p-4 bg-amber-100 rounded-full mb-4">
                <Coffee className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thés et infusions</h3>
              <p className="text-gray-600">Thés glacés, infusions et boissons chaudes diverses</p>
            </div>

            {/* Category 3 */}
            <div className="bg-purple-50 rounded-lg p-8 text-center transition-transform hover:scale-105 cursor-pointer" onClick={() => navigate("/products")}>
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                <Wine className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Jus et sodas</h3>
              <p className="text-gray-600">Jus de fruits frais et sodas artisanaux</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Produits populaires</h2>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Voir tout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg bg-white shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Rejoignez notre newsletter</h2>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Inscrivez-vous pour recevoir en avant-première nos nouvelles boissons et offres spéciales
          </p>
          <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-grow px-4 py-2 rounded-md outline-none text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:ring-white"
            />
            <Button variant="secondary" className="text-primary">
              S'inscrire
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
