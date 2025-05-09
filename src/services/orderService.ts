
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { Order } from '@/models/types';
import { toast } from "sonner";
import { sanitizeInput } from '@/utils/securityUtils';

/**
 * Service pour gérer les commandes dans MongoDB
 */
export const orderService = {
  /**
   * Obtient toutes les commandes
   */
  getAllOrders: async (): Promise<Order[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.log("Récupération des commandes depuis localStorage");
        // Récupérer depuis localStorage pour démo
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
      }
      console.log("Récupération des commandes depuis MongoDB");
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      throw error;
    }
  },

  /**
   * Obtient les commandes d'un utilisateur
   */
  getUserOrders: async (userId: string): Promise<Order[]> => {
    try {
      const safeUserId = sanitizeInput(userId);
      
      if (!MONGODB_CONFIG.isConnected) {
        console.log(`Récupération des commandes de l'utilisateur depuis localStorage:`, safeUserId);
        const savedOrders = localStorage.getItem('orders');
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        return orders.filter((order: Order) => order.userId === safeUserId);
      }
      console.log(`Récupération des commandes de l'utilisateur ${safeUserId} depuis MongoDB`);
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes de l'utilisateur:", error);
      throw error;
    }
  },

  /**
   * Ajoute une nouvelle commande
   */
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    try {
      // Sécurisation des entrées sensibles
      const safeOrderData = {
        ...orderData,
        userId: sanitizeInput(orderData.userId),
        shippingAddress: {
          ...orderData.shippingAddress,
          fullName: sanitizeInput(orderData.shippingAddress.fullName),
          addressLine1: sanitizeInput(orderData.shippingAddress.addressLine1),
          addressLine2: orderData.shippingAddress.addressLine2 ? sanitizeInput(orderData.shippingAddress.addressLine2) : '',
          city: sanitizeInput(orderData.shippingAddress.city),
          state: sanitizeInput(orderData.shippingAddress.state),
          postalCode: sanitizeInput(orderData.shippingAddress.postalCode),
          country: sanitizeInput(orderData.shippingAddress.country),
        },
        paymentMethod: sanitizeInput(orderData.paymentMethod)
      };
      
      if (!MONGODB_CONFIG.isConnected) {
        console.log("Création commande dans localStorage:", safeOrderData);
        
        const newOrder: Order = {
          ...safeOrderData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        
        // Sauvegarde locale pour démonstration
        const savedOrders = localStorage.getItem('orders');
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        toast.success("Commande créée avec succès");
        return newOrder;
      }
      
      console.log("Ajout d'une commande dans MongoDB:", safeOrderData);
      
      const newOrder: Order = {
        ...safeOrderData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      
      return newOrder;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commande:", error);
      toast.error("Erreur lors de la création de la commande");
      throw error;
    }
  },

  /**
   * Met à jour le statut d'une commande
   */
  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    try {
      const safeOrderId = sanitizeInput(orderId);
      const safeStatus = sanitizeInput(status);
      
      if (!MONGODB_CONFIG.isConnected) {
        console.log("Mise à jour statut commande dans localStorage:", safeOrderId, safeStatus);
        
        const savedOrders = localStorage.getItem('orders');
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        const orderIndex = orders.findIndex((order: Order) => order.id === safeOrderId);
        
        if (orderIndex === -1) {
          throw new Error("Commande non trouvée");
        }
        
        orders[orderIndex].status = safeStatus as Order['status'];
        localStorage.setItem('orders', JSON.stringify(orders));
        
        toast.success(`Statut de la commande mis à jour: ${safeStatus}`);
        return orders[orderIndex];
      }
      
      console.log(`Mise à jour du statut de la commande ${safeOrderId} dans MongoDB:`, safeStatus);
      return { id: safeOrderId, status: safeStatus as Order['status'] } as Order;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la commande:", error);
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    }
  }
};
