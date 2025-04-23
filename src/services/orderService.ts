
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { Order, OrderItem } from '@/models/types';
import { toast } from "sonner";

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
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
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
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        const savedOrders = localStorage.getItem('orders');
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        return orders.filter((order: Order) => order.userId === userId);
      }
      console.log(`Récupération des commandes de l'utilisateur ${userId} depuis MongoDB`);
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
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. La commande sera stockée localement.");
        
        const newOrder: Order = {
          ...orderData,
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
      
      console.log("Ajout d'une commande dans MongoDB:", orderData);
      
      const newOrder: Order = {
        ...orderData,
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
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Mise à jour locale.");
        
        const savedOrders = localStorage.getItem('orders');
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
        
        if (orderIndex === -1) {
          throw new Error("Commande non trouvée");
        }
        
        orders[orderIndex].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        
        toast.success(`Statut de la commande mis à jour: ${status}`);
        return orders[orderIndex];
      }
      
      console.log(`Mise à jour du statut de la commande ${orderId} dans MongoDB:`, status);
      return { id: orderId, status } as Order;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la commande:", error);
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    }
  }
};
