
// Utilitaires de sécurité pour protéger les données et prévenir les vulnérabilités

/**
 * Assainit les données d'entrée pour prévenir les attaques XSS (Cross-Site Scripting)
 * @param input - Chaîne à assainir
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Valide une adresse email
 * @param email - Adresse email à valider
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide la force d'un mot de passe
 * @param password - Mot de passe à valider
 */
export const validatePasswordStrength = (password: string): { 
  isValid: boolean; 
  message: string 
} => {
  if (password.length < 8) {
    return { 
      isValid: false, 
      message: 'Le mot de passe doit contenir au moins 8 caractères' 
    };
  }

  if (!/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Le mot de passe doit contenir au moins une majuscule' 
    };
  }

  if (!/[a-z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Le mot de passe doit contenir au moins une minuscule' 
    };
  }

  if (!/[0-9]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Le mot de passe doit contenir au moins un chiffre' 
    };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Le mot de passe doit contenir au moins un caractère spécial' 
    };
  }

  return { isValid: true, message: 'Mot de passe fort' };
};

/**
 * Génère un jeton d'authentification sécurisé
 */
export const generateSecureToken = (): string => {
  // Correction de l'erreur TS2365: utilisation correcte de crypto pour générer un UUID
  return crypto.randomUUID();
};

/**
 * Journalise les événements de sécurité
 * @param event - Description de l'événement
 * @param level - Niveau de gravité
 * @param data - Données associées
 */
export const logSecurityEvent = (
  event: string,
  level: 'info' | 'warning' | 'error',
  data?: Record<string, unknown>
): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [SECURITY] [${level.toUpperCase()}] ${event}`, data || '');
};

/**
 * Détecte les tentatives d'injection
 * @param input - Texte à vérifier
 */
export const detectInjectionAttempt = (input: string): boolean => {
  const sqlPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|CREATE|WHERE)(\s|$)/i,
    /(\s|^)(OR|AND)(\s+)(['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
    /--/,
    /;.*/,
    /\/\*.+\*\//
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

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
