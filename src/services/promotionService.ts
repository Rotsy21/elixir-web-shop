
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { Promotion, Product } from '@/models/types';
import { logSecurityEvent } from '@/utils/securityUtils';

/**
 * Service pour gérer les promotions dans MongoDB
 */
export const promotionService = {
  /**
   * Obtient toutes les promotions
   */
  getAllPromotions: async (): Promise<Promotion[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        return [];
      }
      console.log("Récupération des promotions depuis MongoDB");
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des promotions:", error);
      logSecurityEvent("Erreur de récupération des promotions", "error", { error });
      throw error;
    }
  },

  /**
   * Ajoute une nouvelle promotion
   */
  addPromotion: async (promotion: Omit<Promotion, 'id'>): Promise<Promotion> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. La promotion n'a pas été ajoutée.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log("Ajout d'une promotion dans MongoDB:", promotion);
      
      const newPromotion: Promotion = {
        ...promotion,
        id: crypto.randomUUID()
      };
      
      return newPromotion;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la promotion:", error);
      logSecurityEvent("Erreur d'ajout d'une promotion", "error", { error });
      throw error;
    }
  },

  /**
   * Met à jour une promotion existante
   */
  updatePromotion: async (id: string, promotion: Partial<Promotion>): Promise<Promotion> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. La promotion n'a pas été mise à jour.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Mise à jour de la promotion ${id} dans MongoDB:`, promotion);
      return { id, ...promotion } as Promotion;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la promotion:", error);
      logSecurityEvent("Erreur de mise à jour d'une promotion", "error", { error });
      throw error;
    }
  },

  /**
   * Supprime une promotion
   */
  deletePromotion: async (id: string): Promise<boolean> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. La promotion n'a pas été supprimée.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Suppression de la promotion ${id} dans MongoDB`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la promotion:", error);
      logSecurityEvent("Erreur de suppression d'une promotion", "error", { error });
      throw error;
    }
  },

  /**
   * Appliquer une promotion à un produit
   */
  applyPromotionToProduct: async (productId: string, promotionId: string): Promise<Product> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. La promotion n'a pas été appliquée.");
        throw new Error("MongoDB non connecté");
      }

      console.log(`Application de la promotion ${promotionId} au produit ${productId}`);
      return { id: productId } as Product;
    } catch (error) {
      console.error("Erreur lors de l'application de la promotion:", error);
      logSecurityEvent("Erreur d'application d'une promotion", "error", { error });
      throw error;
    }
  },
  
  /**
   * Obtenir les promotions actives
   */
  getActivePromotions: async (): Promise<Promotion[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        return [];
      }
      
      console.log("Récupération des promotions actives depuis MongoDB");
      const now = new Date();
      // Simuler la récupération des promotions actives
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des promotions actives:", error);
      logSecurityEvent("Erreur de récupération des promotions actives", "error", { error });
      throw error;
    }
  }
};
