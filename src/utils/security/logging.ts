
/**
 * Security logging utilities
 */

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
