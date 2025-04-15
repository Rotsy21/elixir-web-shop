
import { Link } from "react-router-dom";
import { Product } from "@/models/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Fallback image en cas d'erreur de chargement
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <Card className="product-card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
          loading="lazy"
        />
        {product.featured && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Populaire
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
        <div className="mt-2 text-primary font-semibold">{product.price.toFixed(2)} €</div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/products/${product.id}`}>Détails</Link>
        </Button>
        <Button size="sm" className="flex items-center gap-1">
          <ShoppingCart className="h-4 w-4" />
          <span>Ajouter</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
