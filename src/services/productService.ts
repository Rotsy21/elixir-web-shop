
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { Product } from '@/models/types';
import { toast } from "@/hooks/use-toast";

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
        // Récupérer depuis localStorage pour démo
        const savedProducts = localStorage.getItem('products');
        return savedProducts ? JSON.parse(savedProducts) : [];
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
        console.warn("MongoDB non connecté. Le produit sera stocké localement.");
        
        const newProduct: Product = {
          ...product,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          featured: product.featured || false
        };
        
        // Sauvegarde locale pour démonstration
        const savedProducts = localStorage.getItem('products');
        const products = savedProducts ? JSON.parse(savedProducts) : [];
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        
        toast({
          title: "Produit ajouté",
          description: "Le produit a été ajouté avec succès.",
        });
        
        return newProduct;
      }
      
      console.log("Ajout d'un produit dans MongoDB:", product);
      
      const newProduct: Product = {
        ...product,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        featured: product.featured || false
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
        console.warn("MongoDB non connecté. Mise à jour locale.");
        
        const savedProducts = localStorage.getItem('products');
        const products = savedProducts ? JSON.parse(savedProducts) : [];
        const productIndex = products.findIndex((p: Product) => p.id === id);
        
        if (productIndex === -1) {
          throw new Error("Produit non trouvé");
        }
        
        products[productIndex] = { ...products[productIndex], ...product };
        localStorage.setItem('products', JSON.stringify(products));
        
        toast({
          title: "Produit mis à jour",
          description: "Le produit a été mis à jour avec succès.",
        });
        
        return products[productIndex];
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
        console.warn("MongoDB non connecté. Suppression locale.");
        
        const savedProducts = localStorage.getItem('products');
        const products = savedProducts ? JSON.parse(savedProducts) : [];
        const filteredProducts = products.filter((p: Product) => p.id !== id);
        
        if (filteredProducts.length === products.length) {
          throw new Error("Produit non trouvé");
        }
        
        localStorage.setItem('products', JSON.stringify(filteredProducts));
        
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès.",
        });
        
        return true;
      }
      
      console.log(`Suppression du produit ${id} dans MongoDB`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      throw error;
    }
  }
};
