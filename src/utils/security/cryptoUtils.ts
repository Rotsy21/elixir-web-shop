
/**
 * Cryptography related security utilities
 */

/**
 * Génère un jeton d'authentification sécurisé
 */
export const generateSecureToken = (): string => {
  return crypto.randomUUID();
};

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
