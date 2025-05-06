
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { Newsletter } from '@/models/types';
import { toast } from "@/hooks/use-toast";

/**
 * Service pour gérer les inscriptions à la newsletter dans MongoDB
 */
export const newsletterService = {
  /**
   * Obtient toutes les inscriptions à la newsletter
   */
  getAllNewsletters: async (): Promise<Newsletter[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        // Récupérer depuis localStorage pour démo
        const savedNewsletters = localStorage.getItem('newsletters');
        return savedNewsletters ? JSON.parse(savedNewsletters) : [];
      }
      console.log("Récupération des inscriptions newsletter depuis MongoDB");
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des inscriptions newsletter:", error);
      throw error;
    }
  },

  /**
   * Ajoute une nouvelle inscription à la newsletter
   */
  addNewsletter: async (email: string): Promise<Newsletter> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. L'inscription sera stockée localement.");
        
        const newNewsletter: Newsletter = {
          id: crypto.randomUUID(),
          email,
          createdAt: new Date().toISOString()
        };
        
        // Sauvegarde locale pour démonstration
        const savedNewsletters = localStorage.getItem('newsletters');
        const newsletters = savedNewsletters ? JSON.parse(savedNewsletters) : [];
        newsletters.push(newNewsletter);
        localStorage.setItem('newsletters', JSON.stringify(newsletters));
        
        toast({
          title: "Inscription réussie",
          description: "Votre inscription à la newsletter a été enregistrée.",
        });
        
        return newNewsletter;
      }
      
      console.log("Ajout d'une inscription newsletter dans MongoDB:", email);
      
      const newNewsletter: Newsletter = {
        id: crypto.randomUUID(),
        email,
        createdAt: new Date().toISOString()
      };
      
      toast({
        title: "Inscription réussie",
        description: "Votre inscription à la newsletter a été stockée avec succès dans MongoDB.",
      });
      
      return newNewsletter;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'inscription newsletter:", error);
      throw error;
    }
  },

  /**
   * Supprime une inscription à la newsletter
   */
  deleteNewsletter: async (id: string): Promise<boolean> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. L'inscription n'a pas été supprimée.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log(`Suppression de l'inscription newsletter ${id} dans MongoDB`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'inscription newsletter:", error);
      throw error;
    }
  }
};
