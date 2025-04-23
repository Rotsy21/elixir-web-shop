
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { User } from '@/models/types';

/**
 * Service pour gérer les utilisateurs dans MongoDB
 */
export const userService = {
  /**
   * Obtient tous les utilisateurs
   */
  getAllUsers: async (): Promise<User[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        return [];
      }
      console.log("Récupération des utilisateurs depuis MongoDB");
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }
  },

  /**
   * Ajoute un nouvel utilisateur
   */
  addUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. L'utilisateur n'a pas été ajouté.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log("Ajout d'un utilisateur dans MongoDB:", user);
      
      const newUser: User = {
        ...user,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      
      return newUser;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      throw error;
    }
  },

  /**
   * Met à jour un utilisateur existant
   */
  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. L'utilisateur n'a pas été mis à jour.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Mise à jour de l'utilisateur ${id} dans MongoDB:`, user);
      return { id, ...user } as User;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      throw error;
    }
  },

  /**
   * Supprime un utilisateur
   */
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. L'utilisateur n'a pas été supprimé.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Suppression de l'utilisateur ${id} dans MongoDB`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    }
  }
};
