
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { User } from '@/models/types';
import { toast } from "sonner";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

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
      const response = await axios.get(API_URL);
      console.log("Utilisateurs récupérés:", response.data);
      return response.data.map((user: any) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        password: '', // Champ vide pour la compatibilité
        createdAt: user.createdAt
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast.error("Impossible de récupérer la liste des utilisateurs");
      return [];
    }
  },

  /**
   * Ajoute un nouvel utilisateur
   */
  addUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<any> => {
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
          toast.error("Un utilisateur avec cet email existe déjà");
          throw new Error("Email déjà utilisé");
        }
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        toast.success("Le compte a été créé avec succès.");
        
        return { success: true, id: newUser.id };
      }
      
      console.log("Ajout d'un utilisateur dans MongoDB:", user);
      const response = await axios.post(`${API_URL}/register`, user);
      
      toast.success("Le compte a été créé avec succès.");
      return { 
        success: true, 
        id: response.data.user.id || response.data.user._id 
      };
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout de l'utilisateur");
      return { success: false, error };
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
        
        toast.success("L'utilisateur a été mis à jour avec succès.");
        
        return users[userIndex];
      }
      
      console.log(`Mise à jour de l'utilisateur ${id} dans MongoDB:`, user);
      const response = await axios.put(`${API_URL}/${id}`, user);
      toast.success("L'utilisateur a été mis à jour avec succès.");
      
      const updatedUser = {
        id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        password: '', // Champ vide pour la compatibilité
        createdAt: response.data.createdAt
      };
      
      return updatedUser;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
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
        
        toast.success("L'utilisateur a été supprimé avec succès.");
        
        return true;
      }
      
      console.log(`Suppression de l'utilisateur ${id} dans MongoDB`);
      await axios.delete(`${API_URL}/${id}`);
      toast.success("L'utilisateur a été supprimé avec succès.");
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
      throw error;
    }
  }
};
