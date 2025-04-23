
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Product } from "@/models/types";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link to={`/products/${product.id}`}>
        <AspectRatio ratio={1}>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </AspectRatio>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg hover:underline">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className="text-lg font-bold">{product.price.toFixed(2)} €</p>
          {/* Suppression des références à oldPrice qui n'existe pas dans le type Product */}
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}
