
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
  // Patterns SQL avancés pour détecter les tentatives d'injection
  const sqlPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|CREATE|WHERE)(\s|$)/i,
    /(\s|^)(OR|AND)(\s+)(['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
    /--/,
    /;.*/,
    /\/\*.+\*\//,
    /xp_\w+/i, // Procédures étendues SQL Server
    /exec\s*\(/i,
    /WAITFOR\s+DELAY/i,
    /BENCHMARK\(/i,
    /SLEEP\(/i,
    /INTO\s+OUTFILE/i,
    /LOAD_FILE/i
  ];
  
  // Patterns NoSQL pour MongoDB
  const noSqlPatterns = [
    /\$where\s*:/i,
    /\$ne\s*:/i,
    /\$gt\s*:/i,
    /\$lt\s*:/i,
    /\$elemMatch\s*:/i,
    /\$regex\s*:/i,
    /\$where\s*:.+(?:eval|setTimeout|setInterval)/i
  ];
  
  // Patterns d'injection de commandes OS
  const commandInjectionPatterns = [
    /;\s*(?:rm|chmod|wget|curl|bash|sh|cat|echo)/i,
    /\|\s*(?:rm|chmod|wget|curl|bash|sh|cat|echo)/i,
    /`(?:rm|chmod|wget|curl|bash|sh|cat|echo)/i,
    /\$\((?:rm|chmod|wget|curl|bash|sh|cat|echo)/i
  ];
  
  return (
    sqlPatterns.some(pattern => pattern.test(input)) ||
    noSqlPatterns.some(pattern => pattern.test(input)) ||
    commandInjectionPatterns.some(pattern => pattern.test(input))
  );
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

/**
 * Génère un sel cryptographique pour le hachage des mots de passe
 */
export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hache un mot de passe avec un sel
 * Note: Dans un environnement de production réel, utiliser bcrypt côté serveur
 */
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${hashHex}.${salt}`;
};

/**
 * Valide les entrées de l'utilisateur et nettoie les données
 * @param data - Données à valider
 * @param schema - Schéma de validation
 */
export const validateAndSanitizeInput = (
  data: Record<string, any>, 
  schema: Record<string, {
    type: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  }>
): { 
  isValid: boolean; 
  sanitizedData: Record<string, any>; 
  errors: Record<string, string> 
} => {
  const sanitizedData: Record<string, any> = {};
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Vérifier si le champ est requis
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = `Le champ ${field} est requis`;
      isValid = false;
      continue;
    }

    // Si le champ n'est pas requis et n'a pas de valeur, sauter les autres validations
    if ((value === undefined || value === null || value === '') && !rules.required) {
      continue;
    }

    // Vérifier le type
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors[field] = `Le champ ${field} doit être une chaîne de caractères`;
          isValid = false;
          continue;
        }
        sanitizedData[field] = sanitizeInput(value);

        // Vérifier la longueur minimale
        if (rules.minLength !== undefined && value.length < rules.minLength) {
          errors[field] = `Le champ ${field} doit contenir au moins ${rules.minLength} caractères`;
          isValid = false;
          continue;
        }

        // Vérifier la longueur maximale
        if (rules.maxLength !== undefined && value.length > rules.maxLength) {
          errors[field] = `Le champ ${field} ne doit pas dépasser ${rules.maxLength} caractères`;
          isValid = false;
          continue;
        }

        // Vérifier le pattern
        if (rules.pattern && !rules.pattern.test(value)) {
          errors[field] = `Le format du champ ${field} est invalide`;
          isValid = false;
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !validateEmail(value)) {
          errors[field] = `Le champ ${field} doit être une adresse email valide`;
          isValid = false;
          continue;
        }
        sanitizedData[field] = sanitizeInput(value);
        break;

      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          errors[field] = `Le champ ${field} doit être un nombre`;
          isValid = false;
          continue;
        }
        sanitizedData[field] = num;
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors[field] = `Le champ ${field} doit être un booléen`;
          isValid = false;
          continue;
        }
        sanitizedData[field] = value;
        break;

      default:
        sanitizedData[field] = typeof value === 'string' ? sanitizeInput(value) : value;
    }
  }

  return { isValid, sanitizedData, errors };
};
