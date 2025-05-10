
/**
 * Utilitaire de gestion d'erreurs sécurisée
 * Évite de divulguer des informations sensibles dans les messages d'erreur
 */

import { logSecurityEvent } from "./security";

// Types d'erreurs
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  EXTERNAL = 'EXTERNAL_SERVICE_ERROR',
  SECURITY = 'SECURITY_ERROR'
}

// Interface pour les erreurs d'application
export interface AppError {
  type: ErrorType;
  message: string;
  publicMessage: string;
  originalError?: unknown;
  statusCode?: number;
}

/**
 * Crée une erreur formatée pour l'application
 */
export const createAppError = (
  type: ErrorType, 
  message: string, 
  originalError?: unknown, 
  statusCode = 500
): AppError => {
  // Messages génériques pour les utilisateurs
  const publicMessages: Record<ErrorType, string> = {
    [ErrorType.VALIDATION]: "Les données fournies sont invalides.",
    [ErrorType.AUTHENTICATION]: "Problème d'authentification.",
    [ErrorType.AUTHORIZATION]: "Vous n'avez pas les permissions nécessaires.",
    [ErrorType.NOT_FOUND]: "La ressource demandée n'a pas été trouvée.",
    [ErrorType.SERVER]: "Une erreur interne s'est produite.",
    [ErrorType.EXTERNAL]: "Problème avec un service externe.",
    [ErrorType.SECURITY]: "Une erreur de sécurité s'est produite."
  };

  // Journaliser l'erreur sans exposer de détails sensibles
  const level = type === ErrorType.SECURITY ? 'error' : 'warning';
  logSecurityEvent(`${type}: ${message}`, level, { originalError });

  return {
    type,
    message, // Message interne détaillé (pour les logs)
    publicMessage: publicMessages[type], // Message public générique
    originalError,
    statusCode
  };
};

/**
 * Gère une erreur en retournant une réponse sécurisée
 */
export const handleError = (error: unknown): { message: string; status: number } => {
  let appError: AppError;
  
  if ((error as AppError).type) {
    appError = error as AppError;
  } else {
    // Erreur non formatée, la traiter comme erreur serveur
    appError = createAppError(
      ErrorType.SERVER,
      error instanceof Error ? error.message : 'Erreur inconnue',
      error
    );
  }
  
  return {
    message: appError.publicMessage,
    status: appError.statusCode || 500
  };
};
