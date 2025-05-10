
/**
 * Security utilities related to authentication
 */

import { logSecurityEvent, validateEmail, detectInjectionAttempt } from "@/utils/securityUtils";

/**
 * Rationnaliser l'accès en limitant les tentatives pour prévenir les attaques par force brute
 */
export const authRateLimiter = (() => {
  const attempts: Record<string, { count: number; lastAttempt: number }> = {};
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes en millisecondes

  return {
    checkAttempts: (ip: string): { allowed: boolean; remainingTime?: number } => {
      const now = Date.now();
      const attempt = attempts[ip];

      if (!attempt) {
        attempts[ip] = { count: 1, lastAttempt: now };
        return { allowed: true };
      }

      // Si le temps de blocage est passé, réinitialiser les tentatives
      if (attempt.count >= MAX_ATTEMPTS && now - attempt.lastAttempt > LOCKOUT_TIME) {
        attempts[ip] = { count: 1, lastAttempt: now };
        return { allowed: true };
      }

      // Si l'utilisateur a dépassé le nombre maximal de tentatives
      if (attempt.count >= MAX_ATTEMPTS) {
        const remainingTime = LOCKOUT_TIME - (now - attempt.lastAttempt);
        return { allowed: false, remainingTime };
      }

      // Incrémenter le compteur de tentatives
      attempts[ip].count += 1;
      attempts[ip].lastAttempt = now;
      return { allowed: true };
    },
    
    resetAttempts: (ip: string): void => {
      delete attempts[ip];
    }
  };
})();

/**
 * Vérifier les données d'authentification pour la sécurité
 */
export const validateAuthInputs = (email: string, ipAddress = "127.0.0.1") => {
  // Validation de l'email et recherche d'injections
  if (!validateEmail(email) || detectInjectionAttempt(email)) {
    logSecurityEvent(`Tentative d'injection dans le champ email: ${email}`, 'warning', { ipAddress });
    return false;
  }
  return true;
};
