
/**
 * Input sanitization and validation utilities
 */

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
