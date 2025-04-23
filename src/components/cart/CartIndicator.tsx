
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function CartIndicator() {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();
  
  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 min-w-[1.1rem] h-5 flex items-center justify-center">
            {itemCount}
          </Badge>
        )}
        <span className="sr-only">Panier ({itemCount} articles)</span>
      </Link>
    </Button>
  );
}
