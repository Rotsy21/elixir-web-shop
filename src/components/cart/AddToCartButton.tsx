
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/models/types";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  product: Product;
  showQuantity?: boolean;
  className?: string;
}

export default function AddToCartButton({ 
  product, 
  showQuantity = false,
  className = ""
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  if (!showQuantity) {
    return (
      <Button 
        onClick={handleAddToCart} 
        className={className}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Ajouter au panier
      </Button>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={decreaseQuantity} 
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Réduire</span>
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={increaseQuantity}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Augmenter</span>
        </Button>
      </div>
      <Button onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Ajouter au panier
      </Button>
    </div>
  );
}
