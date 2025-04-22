
import { User } from '@/models/types';

export const userService = {
  async getUsers(): Promise<User[]> {
    console.log("Récupération des utilisateurs");
    return [];
  },
  
  async addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    console.log("Ajout d'un nouvel utilisateur:", user);
    return {
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      ...user
    };
  },
  
  async updateUser(id: string, user: Partial<User>): Promise<boolean> {
    console.log("Mise à jour de l'utilisateur:", id, user);
    return true;
  },
  
  async deleteUser(id: string): Promise<boolean> {
    console.log("Suppression de l'utilisateur:", id);
    return true;
  }
};
