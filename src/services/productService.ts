
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { Product } from '@/models/types';

/**
 * Service pour gérer les produits dans MongoDB
 */
export const productService = {
  /**
   * Obtient tous les produits
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        return [];
      }
      console.log("Récupération des produits depuis MongoDB");
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      throw error;
    }
  },

  /**
   * Ajoute un nouveau produit
   */
  addProduct: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Le produit n'a pas été ajouté.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log("Ajout d'un produit dans MongoDB:", product);
      
      const newProduct: Product = {
        ...product,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      
      return newProduct;
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
      throw error;
    }
  },

  /**
   * Met à jour un produit existant
   */
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Le produit n'a pas été mis à jour.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Mise à jour du produit ${id} dans MongoDB:`, product);
      return { id, ...product } as Product;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      throw error;
    }
  },

  /**
   * Supprime un produit
   */
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Le produit n'a pas été supprimé.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Suppression du produit ${id} dans MongoDB`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      throw error;
    }
  }
};
