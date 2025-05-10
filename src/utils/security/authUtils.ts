
/**
 * Authentication related security utilities
 */

/**
 * Vérifie si une action est autorisée pour un utilisateur
 * @param userRole - Rôle de l'utilisateur
 * @param requiredRole - Rôle requis pour l'action
 */
export const isActionAuthorized = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'admin': 3,
    'manager': 2,
    'user': 1,
    'guest': 0
  };

  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
         roleHierarchy[requiredRole as keyof typeof roleHierarchy];
};

/**
 * Crée un identifiant unique pour une session
 */
export const createSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Limite les tentatives de connexion pour prévenir les attaques par force brute
 */
export const rateLimiter = (() => {
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
