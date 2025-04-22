
import { ContactMessage } from '@/models/types';

export const contactService = {
  async getContacts(): Promise<ContactMessage[]> {
    console.log("Récupération des messages de contact");
    return [];
  },
  
  async addContact(contact: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
    console.log("Ajout d'un nouveau message de contact:", contact);
    return {
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      read: false,
      ...contact
    };
  },
  
  async updateContact(id: string, contact: Partial<ContactMessage>): Promise<boolean> {
    console.log("Mise à jour du message de contact:", id, contact);
    return true;
  },
  
  async deleteContact(id: string): Promise<boolean> {
    console.log("Suppression du message de contact:", id);
    return true;
  }
};
