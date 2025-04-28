
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { DeveloperSpecialty } from '@/models/types';
import { logSecurityEvent } from '@/utils/securityUtils';

/**
 * Service pour gérer les spécialités du développeur dans MongoDB
 */
export const developerSpecialtyService = {
  /**
   * Obtient toutes les spécialités
   */
  getAllSpecialties: async (): Promise<DeveloperSpecialty[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        return [
          {
            id: "1",
            name: "Développement Web Frontend",
            description: "Expertise en HTML, CSS, JavaScript et frameworks modernes comme React",
            icon: "code",
            level: "expert"
          },
          {
            id: "2",
            name: "Sécurité Web",
            description: "Protection contre les vulnérabilités et implémentation des meilleures pratiques de sécurité",
            icon: "shield",
            level: "expert"
          },
          {
            id: "3",
            name: "API REST",
            description: "Conception et développement d'APIs RESTful performantes et sécurisées",
            icon: "server",
            level: "expert"
          }
        ];
      }
      console.log("Récupération des spécialités depuis MongoDB");
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des spécialités:", error);
      logSecurityEvent("Erreur de récupération des spécialités", "error", { error });
      throw error;
    }
  },

  /**
   * Ajoute une nouvelle spécialité
   */
  addSpecialty: async (specialty: Omit<DeveloperSpecialty, 'id'>): Promise<DeveloperSpecialty> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. La spécialité n'a pas été ajoutée.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log("Ajout d'une spécialité dans MongoDB:", specialty);
      
      const newSpecialty: DeveloperSpecialty = {
        ...specialty,
        id: crypto.randomUUID()
      };
      
      return newSpecialty;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la spécialité:", error);
      logSecurityEvent("Erreur d'ajout d'une spécialité", "error", { error });
      throw error;
    }
  },

  /**
   * Met à jour une spécialité existante
   */
  updateSpecialty: async (id: string, specialty: Partial<DeveloperSpecialty>): Promise<DeveloperSpecialty> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. La spécialité n'a pas été mise à jour.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Mise à jour de la spécialité ${id} dans MongoDB:`, specialty);
      return { id, ...specialty } as DeveloperSpecialty;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la spécialité:", error);
      logSecurityEvent("Erreur de mise à jour d'une spécialité", "error", { error });
      throw error;
    }
  },

  /**
   * Supprime une spécialité
   */
  deleteSpecialty: async (id: string): Promise<boolean> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. La spécialité n'a pas été supprimée.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Suppression de la spécialité ${id} dans MongoDB`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la spécialité:", error);
      logSecurityEvent("Erreur de suppression d'une spécialité", "error", { error });
      throw error;
    }
  }
};
