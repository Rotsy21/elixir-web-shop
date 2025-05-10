
/**
 * Mock authentication service for development/demonstration
 */

import { User } from "@/models/types";

// Fonctions de simulation pour l'exemple - à supprimer en production
export async function mockLogin(email: string, password: string): Promise<User | null> {
  // Simuler la recherche dans une base de données
  // En production, utilisez une vraie base de données et comparez des hachages sécurisés
  const savedUsers = localStorage.getItem('users');
  const users = savedUsers ? JSON.parse(savedUsers) : [];
  
  // Comparer email et mot de passe
  const user = users.find((u: User) => u.email === email && u.password === password);
  
  if (user) {
    return user;
  }
  
  // Utilisateurs de test hardcodés
  if (email === "admin@example.com" && password === "admin123") {
    return {
      id: "1",
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // Normalement, ceci ne serait jamais retourné
      role: "admin",
      createdAt: new Date().toISOString()
    };
  }
  
  if (email === "user1@example.com" && password === "user123") {
    return {
      id: "2",
      username: "user1",
      email: "user1@example.com",
      password: "user123", // Normalement, ceci ne serait jamais retourné
      role: "user",
      createdAt: new Date().toISOString()
    };
  }
  
  return null;
}

export async function mockRegister(username: string, email: string, password: string): Promise<User | null> {
  // Générer un ID unique
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // Créer le nouvel utilisateur
  return {
    id,
    username,
    email,
    password, // En production, il faudrait hacher le mot de passe
    role: "user",
    createdAt: new Date().toISOString()
  };
}
