
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { User } from '@/models/types';
import { toast } from "@/hooks/use-toast";

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
        // Récupérer depuis localStorage pour démo
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [];
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
        console.warn("MongoDB non connecté. L'utilisateur sera stocké localement.");
        
        const newUser: User = {
          ...user,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        
        // Sauvegarde locale pour démonstration
        const savedUsers = localStorage.getItem('users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        
        // Vérifier si l'email existe déjà
        const existingUserIndex = users.findIndex((u: User) => u.email === user.email);
        if (existingUserIndex >= 0) {
          toast({
            title: "Erreur",
            description: "Un utilisateur avec cet email existe déjà",
            variant: "destructive",
          });
          throw new Error("Email déjà utilisé");
        }
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        toast({
          title: "Compte créé",
          description: "Le compte a été créé avec succès.",
        });
        
        return newUser;
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
        console.warn("MongoDB non connecté. Mise à jour locale.");
        
        const savedUsers = localStorage.getItem('users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const userIndex = users.findIndex((u: User) => u.id === id);
        
        if (userIndex === -1) {
          throw new Error("Utilisateur non trouvé");
        }
        
        users[userIndex] = { ...users[userIndex], ...user };
        localStorage.setItem('users', JSON.stringify(users));
        
        toast({
          title: "Utilisateur mis à jour",
          description: "L'utilisateur a été mis à jour avec succès.",
        });
        
        return users[userIndex];
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
        console.warn("MongoDB non connecté. Suppression locale.");
        
        const savedUsers = localStorage.getItem('users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const filteredUsers = users.filter((u: User) => u.id !== id);
        
        if (filteredUsers.length === users.length) {
          throw new Error("Utilisateur non trouvé");
        }
        
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès.",
        });
        
        return true;
      }
      
      console.log(`Suppression de l'utilisateur ${id} dans MongoDB`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    }
  }
};
