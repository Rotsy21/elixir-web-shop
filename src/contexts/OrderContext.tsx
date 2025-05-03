
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Order, ShippingAddress } from "../models/types";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  isLoading: boolean;
  createOrder: (shippingAddress: ShippingAddress, paymentMethod: string) => Promise<Order | null>;
  getUserOrders: () => Promise<void>;
  getOrdersByUserId: (userId: string) => Promise<Order[]>; // Ajout de cette fonction manquante
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();

  useEffect(() => {
    // Charger les commandes de l'utilisateur connecté
    if (user) {
      getUserOrders();
    } else {
      setUserOrders([]);
    }
  }, [user]);

  const getUserOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedOrders = await orderService.getUserOrders(user.id);
      setUserOrders(fetchedOrders);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      toast.error("Impossible de charger vos commandes");
    } finally {
      setIsLoading(false);
    }
  };

  // Implémentation de la fonction getOrdersByUserId
  const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
    setIsLoading(true);
    try {
      const fetchedOrders = await orderService.getUserOrders(userId);
      return fetchedOrders;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      toast.error("Impossible de charger les commandes");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (shippingAddress: ShippingAddress, paymentMethod: string): Promise<Order | null> => {
    if (!user) {
      toast.error("Vous devez être connecté pour passer une commande");
      return null;
    }

    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return null;
    }

    setIsLoading(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price
      }));

      const orderData = {
        userId: user.id,
        items: orderItems,
        totalAmount: getTotalPrice(),
        status: 'pending' as const,
        shippingAddress,
        paymentMethod
      };

      const newOrder = await orderService.createOrder(orderData);
      setOrders(prevOrders => [...prevOrders, newOrder]);
      setUserOrders(prevOrders => [...prevOrders, newOrder]);
      clearCart();
      toast.success("Commande créée avec succès");
      return newOrder;
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error("Erreur lors de la création de la commande");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        userOrders,
        isLoading,
        createOrder,
        getUserOrders,
        getOrdersByUserId, // Ajout de la fonction dans le contexte
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder doit être utilisé à l'intérieur d'un OrderProvider");
  }
  return context;
}
