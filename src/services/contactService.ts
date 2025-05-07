
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { ContactMessage } from '@/models/types';
import { toast } from "sonner";

/**
 * Service pour gérer les messages de contact dans MongoDB
 */
export const contactService = {
  /**
   * Obtient tous les messages de contact
   */
  getAllContacts: async (): Promise<ContactMessage[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        // Récupérer depuis localStorage pour démo
        const savedContacts = localStorage.getItem('contacts');
        return savedContacts ? JSON.parse(savedContacts) : [];
      }
      console.log("Récupération des contacts depuis MongoDB");
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
      throw error;
    }
  },

  /**
   * Ajoute un nouveau message de contact
   */
  addContact: async (contact: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Le message sera stocké localement.");
        
        const newContact: ContactMessage = {
          ...contact,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date().toISOString()
        };
        
        // Sauvegarde locale pour démonstration
        const savedContacts = localStorage.getItem('contacts');
        const contacts = savedContacts ? JSON.parse(savedContacts) : [];
        contacts.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        toast.success("Votre message a été envoyé avec succès.");
        
        return newContact;
      }
      
      console.log("Ajout d'un message de contact dans MongoDB:", contact);
      
      const newContact: ContactMessage = {
        ...contact,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date().toISOString()
      };
      
      toast.success("Votre message a été envoyé avec succès.");
      
      return newContact;
    } catch (error) {
      console.error("Erreur lors de l'ajout du message de contact:", error);
      toast.error("Une erreur s'est produite lors de l'envoi du message.");
      throw error;
    }
  },

  /**
   * Met à jour un message de contact existant
   */
  updateContact: async (id: string, contact: Partial<ContactMessage>): Promise<ContactMessage> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Mise à jour locale.");
        const savedContacts = localStorage.getItem('contacts');
        const contacts = savedContacts ? JSON.parse(savedContacts) : [];
        
        const contactIndex = contacts.findIndex((c: ContactMessage) => c.id === id);
        if (contactIndex === -1) {
          throw new Error("Message non trouvé");
        }
        
        contacts[contactIndex] = { ...contacts[contactIndex], ...contact };
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        return contacts[contactIndex];
      }
      
      console.log(`Mise à jour du message de contact ${id} dans MongoDB:`, contact);
      return { id, ...contact } as ContactMessage;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du message de contact:", error);
      throw error;
    }
  },

  /**
   * Marque un message comme lu
   */
  markAsRead: async (id: string): Promise<ContactMessage> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Mise à jour locale.");
        
        const savedContacts = localStorage.getItem('contacts');
        const contacts = savedContacts ? JSON.parse(savedContacts) : [];
        
        const contactIndex = contacts.findIndex((c: ContactMessage) => c.id === id);
        if (contactIndex === -1) {
          throw new Error("Message non trouvé");
        }
        
        contacts[contactIndex].read = true;
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        return contacts[contactIndex];
      }
      
      console.log(`Marquage du message ${id} comme lu dans MongoDB`);
      return { id, read: true } as ContactMessage;
    } catch (error) {
      console.error("Erreur lors du marquage du message comme lu:", error);
      throw error;
    }
  },

  /**
   * Supprime un message de contact
   */
  deleteContact: async (id: string): Promise<boolean> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Suppression locale.");
        
        const savedContacts = localStorage.getItem('contacts');
        const contacts = savedContacts ? JSON.parse(savedContacts) : [];
        
        const newContacts = contacts.filter((c: ContactMessage) => c.id !== id);
        localStorage.setItem('contacts', JSON.stringify(newContacts));
        
        toast.success("Message supprimé avec succès");
        return true;
      }
      
      console.log(`Suppression du message de contact ${id} dans MongoDB`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du message de contact:", error);
      throw error;
    }
  }
};
