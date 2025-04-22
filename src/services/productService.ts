
import { Product } from '@/models/types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    console.log("Récupération des produits");
    return [];
  },
  
  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    console.log("Ajout d'un nouveau produit:", product);
    return {
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      ...product
    };
  },
  
  async updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
    console.log("Mise à jour du produit:", id, product);
    return true;
  },
  
  async deleteProduct(id: string): Promise<boolean> {
    console.log("Suppression du produit:", id);
    return true;
  }
};
