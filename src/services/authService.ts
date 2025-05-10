
/**
 * Service d'authentification sécurisé
 */

import { User } from "@/models/types";
import { 
  sanitizeInput, 
  validateEmail, 
  validatePasswordStrength, 
  detectInjectionAttempt,
  logSecurityEvent 
} from "@/utils/securityUtils";
import { createAppError, ErrorType } from "@/utils/errorHandler";
import { toast } from "sonner";
import axios from "axios";

const API_URL = 'http://localhost:5000/api/users';

// Simuler le stockage des jetons d'accès et de rafraîchissement
// En production, utilisez un stockage sécurisé comme HttpOnly cookies
interface TokenStore {
  [userId: string]: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
}

const tokenStore: TokenStore = {};

/**
 * Service sécurisé d'authentification
 */
export const authService = {
  /**
   * Connexion sécurisée
   */
  login: async (email: string, password: string, ipAddress = "127.0.0.1"): Promise<Omit<User, "password"> | null> => {
    try {
      // Validation de l'email et recherche d'injections
      if (!validateEmail(email) || detectInjectionAttempt(email)) {
        logSecurityEvent(`Tentative d'injection dans le champ email: ${email}`, 'warning', { ipAddress });
        throw createAppError(
          ErrorType.VALIDATION,
          "Format d'email invalide ou tentative d'injection détectée",
          null,
          400
        );
      }
      
      try {
        console.log(`Tentative de connexion à ${API_URL}/login avec email: ${email}`);
        const response = await axios.post(`${API_URL}/login`, { email, password });
        console.log("Réponse de connexion:", response.data);
        
        if (!response.data || !response.data.user) {
          console.error("Format de réponse invalide:", response.data);
          toast.error("Format de réponse invalide du serveur");
          return null;
        }
        
        // Générer les jetons d'authentification
        const userId = response.data.user.id;
        const now = Date.now();
        const accessTokenExpire = now + (30 * 60 * 1000); // 30 minutes
        
        tokenStore[userId] = {
          accessToken: response.data.token,
          refreshToken: `refresh_${Math.random().toString(36).slice(2)}`,
          expiresAt: accessTokenExpire
        };
        
        logSecurityEvent(`Connexion réussie pour: ${email}`, 'info', { userId });
        
        // Convertir la réponse API en objet User
        const user: Omit<User, "password"> = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          createdAt: response.data.user.createdAt
        };
        
        console.log("Utilisateur connecté:", user);
        return user;
      } catch (err: any) {
        // En cas d'échec, attendre un délai aléatoire pour prévenir les attaques par force brute
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 200));
        
        console.error("Erreur de connexion:", err);
        if (err.response) {
          console.error("Réponse d'erreur:", err.response.data);
          toast.error(err.response.data.message || "Échec de connexion");
        } else {
          console.error("Erreur réseau:", err.message);
          toast.error("Erreur de connexion au serveur. Vérifiez que le serveur est en cours d'exécution.");
        }
        
        logSecurityEvent(`Échec de connexion pour: ${email}`, 'warning', { ipAddress });
        return null;
      }
    } catch (error) {
      // Journaliser l'erreur sans exposer les détails sensibles
      console.error("Erreur dans le processus d'authentification:", error);
      logSecurityEvent("Erreur d'authentification", 'error', { error });
      throw error;
    }
  },

  /**
   * Inscription sécurisée
   */
  register: async (username: string, email: string, password: string): Promise<Omit<User, "password"> | null> => {
    try {
      // Assainir les entrées
      const sanitizedUsername = sanitizeInput(username);
      
      // Valider l'email
      if (!validateEmail(email)) {
        toast.error("Format d'email invalide");
        throw createAppError(
          ErrorType.VALIDATION,
          "Format d'email invalide",
          null,
          400
        );
      }
      
      // Vérifier la force du mot de passe
      const passwordCheck = validatePasswordStrength(password);
      if (!passwordCheck.isValid) {
        toast.error(passwordCheck.message);
        throw createAppError(
          ErrorType.VALIDATION,
          passwordCheck.message,
          null,
          400
        );
      }
      
      // Vérifier les tentatives d'injection
      if (
        detectInjectionAttempt(username) || 
        detectInjectionAttempt(email) || 
        detectInjectionAttempt(password)
      ) {
        logSecurityEvent(`Tentative d'injection détectée lors de l'inscription`, 'warning', {
          username,
          email
        });
        toast.error("Tentative d'injection détectée");
        throw createAppError(
          ErrorType.SECURITY,
          "Tentative d'injection détectée",
          null,
          400
        );
      }
      
      try {
        console.log(`Tentative d'inscription à ${API_URL}/register avec username: ${sanitizedUsername}, email: ${email}`);
        const response = await axios.post(`${API_URL}/register`, {
          username: sanitizedUsername,
          email,
          password
        });
        console.log("Réponse d'inscription:", response.data);
        
        if (!response.data || !response.data.user) {
          console.error("Format de réponse invalide:", response.data);
          toast.error("Format de réponse invalide du serveur");
          return null;
        }
        
        logSecurityEvent(`Inscription réussie pour: ${email}`, 'info');
        
        // Convertir la réponse API en objet User
        const user: Omit<User, "password"> = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          createdAt: response.data.user.createdAt
        };
        
        console.log("Utilisateur inscrit:", user);
        return user;
      } catch (err: any) {
        console.error("Erreur d'inscription:", err);
        if (err.response) {
          console.error("Réponse d'erreur:", err.response.data);
          toast.error(err.response.data.message || "Échec de l'inscription");
        } else {
          console.error("Erreur réseau:", err.message);
          toast.error("Erreur de connexion au serveur. Vérifiez que le serveur est en cours d'exécution.");
        }
        return null;
      }
    } catch (error) {
      // Journaliser l'erreur sans exposer les détails sensibles
      console.error("Erreur dans le processus d'inscription:", error);
      logSecurityEvent("Erreur d'inscription", 'error', { error });
      throw error;
    }
  },

  /**
   * Déconnexion sécurisée
   */
  logout: (userId: string): void => {
    // Supprimer les jetons d'authentification
    delete tokenStore[userId];
    logSecurityEvent(`Déconnexion de l'utilisateur: ${userId}`, 'info');
  },

  /**
   * Vérifier si un jeton est valide
   */
  verifyToken: (userId: string, token: string): boolean => {
    const userTokens = tokenStore[userId];
    
    if (!userTokens) {
      return false;
    }
    
    // Vérifier si le jeton est valide et n'a pas expiré
    return userTokens.accessToken === token && userTokens.expiresAt > Date.now();
  }
};

// Fonctions de simulation pour l'exemple - à supprimer en production
async function mockLogin(email: string, password: string): Promise<User | null> {
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

async function mockRegister(username: string, email: string, password: string): Promise<User | null> {
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
