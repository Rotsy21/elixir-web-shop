
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "../models/types";
import { toast } from "sonner";

type CartItem = {
  product: Product;
  quantity: number;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Essayer de charger le panier depuis le localStorage
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Sauvegarder le panier dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        // Produit déjà dans le panier, mettre à jour la quantité
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        toast.success(`Quantité mise à jour: ${product.name}`);
        return newItems;
      } else {
        // Nouveau produit, l'ajouter au panier
        toast.success(`Ajouté au panier: ${product.name}`);
        return [...currentItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast.info(`Retiré du panier: ${itemToRemove.product.name}`);
      }
      return currentItems.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info("Panier vidé");
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
}
