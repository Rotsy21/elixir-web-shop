
/**
 * Service d'authentification sécurisé
 * Version refactorisée et modulaire
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
import { tokenService } from "./tokenService";
import { validateAuthInputs, authRateLimiter } from "./securityUtils";

const API_URL = 'http://localhost:5000/api/users';

/**
 * Service sécurisé d'authentification
 */
export const authService = {
  /**
   * Connexion sécurisée
   */
  login: async (email: string, password: string, ipAddress = "127.0.0.1"): Promise<Omit<User, "password"> | null> => {
    try {
      // Vérifier les limites de tentatives de connexion
      const rateCheck = authRateLimiter.checkAttempts(ipAddress);
      if (!rateCheck.allowed) {
        const minutes = Math.ceil((rateCheck.remainingTime || 0) / (60 * 1000));
        toast.error(`Trop de tentatives. Veuillez réessayer dans ${minutes} minutes.`);
        return null;
      }

      // Validation des entrées
      if (!validateAuthInputs(email, ipAddress)) {
        toast.error("Format d'email invalide ou tentative d'injection détectée");
        return null;
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
        tokenService.storeTokens(userId, response.data.token);
        
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
    tokenService.removeTokens(userId);
    logSecurityEvent(`Déconnexion de l'utilisateur: ${userId}`, 'info');
  },

  /**
   * Vérifier si un jeton est valide
   */
  verifyToken: (userId: string, token: string): boolean => {
    return tokenService.verifyToken(userId, token);
  }
};
