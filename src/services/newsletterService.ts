
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { Newsletter } from '@/models/types';
import { toast } from "sonner";
import { sanitizeInput, validateEmail } from '@/utils/securityUtils';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/newsletters';

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
        console.log("Récupération des newsletters depuis localStorage");
        // Récupérer depuis localStorage pour démo
        const savedNewsletters = localStorage.getItem('newsletters');
        return savedNewsletters ? JSON.parse(savedNewsletters) : [];
      }
      console.log("Récupération des inscriptions newsletter depuis MongoDB");
      const response = await axios.get(API_URL);
      return response.data.map((newsletter: any) => ({
        id: newsletter._id,
        email: newsletter.email,
        createdAt: newsletter.createdAt
      }));
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
      // Validation d'email et sécurisation contre les injections
      const sanitizedEmail = sanitizeInput(email);
      if (!validateEmail(sanitizedEmail)) {
        throw new Error("Format d'email invalide");
      }
      
      if (!MONGODB_CONFIG.isConnected) {
        console.log("Ajout newsletter dans localStorage:", sanitizedEmail);
        
        // Vérifier si l'email existe déjà
        const savedNewsletters = localStorage.getItem('newsletters');
        const newsletters = savedNewsletters ? JSON.parse(savedNewsletters) : [];
        const existingEmail = newsletters.find((n: Newsletter) => n.email === sanitizedEmail);
        
        if (existingEmail) {
          toast.info("Cette adresse email est déjà inscrite à la newsletter.");
          // Retourner l'inscription existante au lieu de lancer une erreur
          return existingEmail;
        }
        
        const newNewsletter: Newsletter = {
          id: crypto.randomUUID(),
          email: sanitizedEmail,
          createdAt: new Date().toISOString()
        };
        
        // Sauvegarde locale pour démonstration
        newsletters.push(newNewsletter);
        localStorage.setItem('newsletters', JSON.stringify(newsletters));
        
        toast.success("Votre inscription à la newsletter a été enregistrée.");
        
        return newNewsletter;
      }
      
      console.log("Ajout d'une inscription newsletter dans MongoDB:", sanitizedEmail);
      
      try {
        const response = await axios.post(API_URL, { email: sanitizedEmail });
        
        const newNewsletter: Newsletter = {
          id: response.data._id,
          email: response.data.email,
          createdAt: response.data.createdAt
        };
        
        toast.success("Votre inscription à la newsletter a été enregistrée.");
        return newNewsletter;
      } catch (err: any) {
        if (err.response && err.response.status === 400) {
          toast.info("Cette adresse email est déjà inscrite à la newsletter.");
          // Retourner une inscription temporaire
          return {
            id: "existing",
            email: sanitizedEmail,
            createdAt: new Date().toISOString()
          };
        }
        throw err;
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'inscription newsletter:", error);
      toast.error("Erreur lors de l'inscription à la newsletter: " + (error as Error).message);
      throw error;
    }
  },

  /**
   * Supprime une inscription à la newsletter
   */
  deleteNewsletter: async (id: string): Promise<boolean> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.log("Suppression newsletter dans localStorage:", id);
        
        const savedNewsletters = localStorage.getItem('newsletters');
        const newsletters = savedNewsletters ? JSON.parse(savedNewsletters) : [];
        const filteredNewsletters = newsletters.filter((n: Newsletter) => n.id !== id);
        
        if (filteredNewsletters.length === newsletters.length) {
          throw new Error("Inscription non trouvée");
        }
        
        localStorage.setItem('newsletters', JSON.stringify(filteredNewsletters));
        
        toast.success("L'inscription à la newsletter a été supprimée avec succès.");
        
        return true;
      }
      
      console.log(`Suppression de l'inscription newsletter ${id} dans MongoDB`);
      
      // Simuler la suppression dans MongoDB
      const savedNewsletters = localStorage.getItem('newsletters');
      const newsletters = savedNewsletters ? JSON.parse(savedNewsletters) : [];
      const filteredNewsletters = newsletters.filter((n: Newsletter) => n.id !== id);
      
      if (filteredNewsletters.length === newsletters.length) {
        throw new Error("Inscription non trouvée");
      }
      
      localStorage.setItem('newsletters', JSON.stringify(filteredNewsletters));
      
      toast.success("L'inscription à la newsletter a été supprimée avec succès.");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'inscription newsletter:", error);
      throw error;
    }
  }
};
