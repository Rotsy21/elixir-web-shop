
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "@/data/mockData";
import { Product } from "@/models/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowLeft, Star, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getProductById(id);
          setProduct(data || null);
        }
      } catch (error) {
        console.error("Failed to load product", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du produit.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} ${product?.name} ajouté(s) au panier.`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Ajouté aux favoris",
      description: `${product?.name} a été ajouté à vos favoris.`,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Fallback image en cas d'erreur de chargement
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <Skeleton className="w-full aspect-square rounded-lg" />
            </div>
            <div className="w-full md:w-1/2">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-6" />
              <Skeleton className="h-24 w-full mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Produit introuvable</h1>
            <p className="mt-2 text-gray-600">Le produit demandé n'existe pas ou a été supprimé.</p>
            <Button asChild className="mt-6">
              <Link to="/products">Voir tous les produits</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products" className="inline-flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour aux produits
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden border bg-gray-100 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            
            {product.featured && (
              <div className="bg-primary text-white text-sm px-3 py-1 rounded-full inline-block mt-4">
                Populaire
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <div className="flex text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5" />
              </div>
              <span className="ml-2 text-sm text-gray-600">4.0 (16 avis)</span>
            </div>
            
            <div className="mt-4 text-2xl font-bold text-primary">
              {product.price.toFixed(2)} €
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900 mr-4">Catégorie:</h3>
                <span className="text-gray-600">{product.category}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900 mr-4">Disponibilité:</h3>
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Rupture de stock"}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="mt-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantité
                </label>
                <div className="mt-1 flex rounded-md">
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="flex items-center"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="flex items-center"
                onClick={handleAddToWishlist}
              >
                <Heart className="mr-2 h-5 w-5" />
                Favoris
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
