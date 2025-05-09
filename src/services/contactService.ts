
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { ContactMessage } from '@/models/types';
import { toast } from "sonner";
import { sanitizeInput, validateEmail, detectInjectionAttempt } from '@/utils/securityUtils';

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
        console.log("Récupération des contacts depuis localStorage");
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
      // Sécurisation des entrées
      const safeContact = {
        name: sanitizeInput(contact.name),
        email: sanitizeInput(contact.email),
        subject: sanitizeInput(contact.subject),
        message: sanitizeInput(contact.message),
      };
      
      // Validation des entrées
      if (!validateEmail(safeContact.email)) {
        throw new Error("Format d'email invalide");
      }
      
      // Détection de tentative d'injection
      if (detectInjectionAttempt(safeContact.message) || 
          detectInjectionAttempt(safeContact.subject)) {
        throw new Error("Contenu non autorisé détecté");
      }
      
      if (!MONGODB_CONFIG.isConnected) {
        console.log("Ajout contact dans localStorage:", safeContact);
        
        const newContact: ContactMessage = {
          ...safeContact,
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
      
      console.log("Ajout d'un message de contact dans MongoDB:", safeContact);
      
      const newContact: ContactMessage = {
        ...safeContact,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date().toISOString()
      };
      
      // Simuler l'ajout dans MongoDB
      const savedContacts = localStorage.getItem('contacts');
      const contacts = savedContacts ? JSON.parse(savedContacts) : [];
      contacts.push(newContact);
      localStorage.setItem('contacts', JSON.stringify(contacts));
      
      toast.success("Votre message a été envoyé avec succès.");
      
      return newContact;
    } catch (error) {
      console.error("Erreur lors de l'ajout du message de contact:", error);
      toast.error("Une erreur s'est produite lors de l'envoi du message: " + (error as Error).message);
      throw error;
    }
  },

  /**
   * Met à jour un message de contact existant
   */
  updateContact: async (id: string, contact: Partial<ContactMessage>): Promise<ContactMessage> => {
    try {
      // Sécurisation des entrées si nécessaire
      const safeUpdates: Partial<ContactMessage> = {};
      if (contact.name) safeUpdates.name = sanitizeInput(contact.name);
      if (contact.email) safeUpdates.email = sanitizeInput(contact.email);
      if (contact.subject) safeUpdates.subject = sanitizeInput(contact.subject);
      if (contact.message) safeUpdates.message = sanitizeInput(contact.message);
      if (contact.read !== undefined) safeUpdates.read = contact.read;
      
      if (!MONGODB_CONFIG.isConnected) {
        console.log("Mise à jour contact dans localStorage:", id);
        const savedContacts = localStorage.getItem('contacts');
        const contacts = savedContacts ? JSON.parse(savedContacts) : [];
        
        const contactIndex = contacts.findIndex((c: ContactMessage) => c.id === id);
        if (contactIndex === -1) {
          throw new Error("Message non trouvé");
        }
        
        contacts[contactIndex] = { ...contacts[contactIndex], ...safeUpdates };
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        return contacts[contactIndex];
      }
      
      console.log(`Mise à jour du message de contact ${id} dans MongoDB:`, safeUpdates);
      
      // Simuler la mise à jour dans MongoDB
      const savedContacts = localStorage.getItem('contacts');
      const contacts = savedContacts ? JSON.parse(savedContacts) : [];
      
      const contactIndex = contacts.findIndex((c: ContactMessage) => c.id === id);
      if (contactIndex === -1) {
        throw new Error("Message non trouvé");
      }
      
      contacts[contactIndex] = { ...contacts[contactIndex], ...safeUpdates };
      localStorage.setItem('contacts', JSON.stringify(contacts));
      
      return contacts[contactIndex];
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
        console.log("Marquage comme lu dans localStorage:", id);
        
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
      
      // Simuler le marquage dans MongoDB
      const savedContacts = localStorage.getItem('contacts');
      const contacts = savedContacts ? JSON.parse(savedContacts) : [];
      
      const contactIndex = contacts.findIndex((c: ContactMessage) => c.id === id);
      if (contactIndex === -1) {
        throw new Error("Message non trouvé");
      }
      
      contacts[contactIndex].read = true;
      localStorage.setItem('contacts', JSON.stringify(contacts));
      
      return contacts[contactIndex];
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
        console.log("Suppression contact dans localStorage:", id);
        
        const savedContacts = localStorage.getItem('contacts');
        const contacts = savedContacts ? JSON.parse(savedContacts) : [];
        
        const newContacts = contacts.filter((c: ContactMessage) => c.id !== id);
        localStorage.setItem('contacts', JSON.stringify(newContacts));
        
        toast.success("Message supprimé avec succès");
        return true;
      }
      
      console.log(`Suppression du message de contact ${id} dans MongoDB`);
      
      // Simuler la suppression dans MongoDB
      const savedContacts = localStorage.getItem('contacts');
      const contacts = savedContacts ? JSON.parse(savedContacts) : [];
      
      const newContacts = contacts.filter((c: ContactMessage) => c.id !== id);
      localStorage.setItem('contacts', JSON.stringify(newContacts));
      
      toast.success("Message supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du message de contact:", error);
      throw error;
    }
  }
};
