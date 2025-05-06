
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
import { toast } from "@/hooks/use-toast";

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

// Simuler une liste d'adresses IP bloquées pour les tentatives d'attaque
const blockedIPs: Set<string> = new Set();

// Simuler un compteur de tentatives de connexion
interface LoginAttempts {
  [ipOrUserId: string]: {
    count: number;
    lastAttempt: number;
  }
}

const loginAttempts: LoginAttempts = {};

/**
 * Service sécurisé d'authentification
 */
export const authService = {
  /**
   * Connexion sécurisée
   */
  login: async (email: string, password: string, ipAddress = "127.0.0.1"): Promise<Omit<User, "password"> | null> => {
    try {
      // Vérifier si l'IP est bloquée
      if (blockedIPs.has(ipAddress)) {
        logSecurityEvent(`Tentative de connexion depuis une IP bloquée: ${ipAddress}`, 'warning');
        throw createAppError(
          ErrorType.SECURITY,
          `Tentative de connexion depuis une IP bloquée: ${ipAddress}`,
          null,
          403
        );
      }

      // Vérifier le nombre de tentatives de connexion
      if (loginAttempts[ipAddress]) {
        const attempt = loginAttempts[ipAddress];
        
        // Si plus de 5 tentatives en moins de 15 minutes, bloquer temporairement
        const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
        if (attempt.count >= 5 && attempt.lastAttempt > fifteenMinutesAgo) {
          logSecurityEvent(`Trop de tentatives de connexion depuis: ${ipAddress}`, 'warning');
          throw createAppError(
            ErrorType.SECURITY,
            "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
            null,
            429
          );
        }
        
        // Réinitialiser le compteur si plus de 15 minutes depuis la dernière tentative
        if (attempt.lastAttempt <= fifteenMinutesAgo) {
          attempt.count = 0;
        }
        
        attempt.count++;
        attempt.lastAttempt = Date.now();
      } else {
        // Première tentative
        loginAttempts[ipAddress] = {
          count: 1,
          lastAttempt: Date.now()
        };
      }

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

      // En production, utilisez une fonction de hachage sécurisée pour comparer les mots de passe
      // comme bcrypt, Argon2 ou PBKDF2
      
      // Simuler la vérification d'authentification
      const result = await mockLogin(email, password);
      
      if (result) {
        // Réinitialiser le compteur de tentatives de connexion
        if (loginAttempts[ipAddress]) {
          loginAttempts[ipAddress].count = 0;
        }
        
        // Générer les jetons d'authentification
        // Dans une implémentation réelle, stocker ces jetons dans des cookies HttpOnly
        const userId = result.id;
        const now = Date.now();
        const accessTokenExpire = now + (30 * 60 * 1000); // 30 minutes
        
        tokenStore[userId] = {
          accessToken: `access_${Math.random().toString(36).slice(2)}`,
          refreshToken: `refresh_${Math.random().toString(36).slice(2)}`,
          expiresAt: accessTokenExpire
        };
        
        logSecurityEvent(`Connexion réussie pour: ${email}`, 'info', { userId });
        
        // Ne jamais renvoyer le mot de passe
        const { password: _, ...userWithoutPassword } = result;
        return userWithoutPassword;
      } else {
        // En cas d'échec, attendre un délai aléatoire pour prévenir les attaques par force brute
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 200));
        
        logSecurityEvent(`Échec de connexion pour: ${email}`, 'warning', { ipAddress });
        return null;
      }
    } catch (error) {
      // Journaliser l'erreur sans exposer les détails sensibles
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
        toast({
          title: "Erreur",
          description: "Format d'email invalide",
          variant: "destructive",
        });
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
        toast({
          title: "Erreur",
          description: passwordCheck.message,
          variant: "destructive",
        });
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
        toast({
          title: "Erreur de sécurité",
          description: "Tentative d'injection détectée",
          variant: "destructive",
        });
        throw createAppError(
          ErrorType.SECURITY,
          "Tentative d'injection détectée",
          null,
          400
        );
      }
      
      // Vérifier si l'email existe déjà
      const savedUsers = localStorage.getItem('users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        toast({
          title: "Erreur d'inscription",
          description: "Cette adresse email est déjà utilisée",
          variant: "destructive",
        });
        return null;
      }
      
      // En production, hachage sécurisé du mot de passe avant stockage
      // Simuler l'inscription
      const result = await mockRegister(sanitizedUsername, email, password);
      
      if (result) {
        // Ajouter l'utilisateur à la liste des utilisateurs dans localStorage
        users.push(result);
        localStorage.setItem('users', JSON.stringify(users));
        
        logSecurityEvent(`Inscription réussie pour: ${email}`, 'info');
        
        // Ne jamais renvoyer le mot de passe
        const { password: _, ...userWithoutPassword } = result;
        return userWithoutPassword;
      }
      
      return null;
    } catch (error) {
      // Journaliser l'erreur sans exposer les détails sensibles
      logSecurityEvent("Erreur d'inscription", 'error', { error });
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
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

// Fonctions de simulation pour l'exemple
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
