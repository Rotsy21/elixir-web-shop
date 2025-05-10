
/**
 * Token management service
 * Handles token generation, storage and validation
 */

interface TokenStore {
  [userId: string]: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
}

// Simuler le stockage des jetons d'accès et de rafraîchissement
// En production, utilisez un stockage sécurisé comme HttpOnly cookies
const tokenStore: TokenStore = {};

export const tokenService = {
  /**
   * Store authentication tokens for a user
   */
  storeTokens: (userId: string, accessToken: string): void => {
    const now = Date.now();
    const accessTokenExpire = now + (30 * 60 * 1000); // 30 minutes
    
    tokenStore[userId] = {
      accessToken: accessToken,
      refreshToken: `refresh_${Math.random().toString(36).slice(2)}`,
      expiresAt: accessTokenExpire
    };
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
  },

  /**
   * Remove all tokens for a user
   */
  removeTokens: (userId: string): void => {
    delete tokenStore[userId];
  }
};
