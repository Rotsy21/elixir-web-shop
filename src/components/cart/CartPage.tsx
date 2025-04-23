
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-16 w-16 mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">Ajoutez des produits pour commencer vos achats</p>
          <Button asChild>
            <Link to="/products">Voir nos produits</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Votre Panier</h1>
      
      <div className="space-y-6 mb-8">
        {items.map((item) => (
          <Card key={item.product.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-40 h-40">
                <AspectRatio ratio={1/1}>
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </AspectRatio>
              </div>
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-muted-foreground">{item.product.price.toFixed(2)} €</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFromCart(item.product.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Retirer du panier</span>
                  </Button>
                </div>
                
                <div className="mt-4 flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Réduire</span>
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                    className="w-16 h-8 mx-2 text-center"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Augmenter</span>
                  </Button>
                  
                  <div className="ml-auto font-medium">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex justify-between mb-2">
            <span>Sous-total ({getTotalItems()} articles)</span>
            <span>{getTotalPrice().toFixed(2)} €</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{getTotalPrice().toFixed(2)} €</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            onClick={clearCart} 
            className="w-full sm:w-auto"
          >
            Vider le panier
          </Button>
          <Button 
            onClick={handleCheckout} 
            disabled={isCheckingOut}
            className="w-full sm:w-auto"
          >
            {isCheckingOut ? "Traitement..." : "Procéder au paiement"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
