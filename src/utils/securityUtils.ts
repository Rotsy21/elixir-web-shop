
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
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
    c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
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
  
  // Dans une application réelle, vous voudriez stocker ces journaux
  // dans un fichier ou une base de données
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
