
import { Newsletter } from '@/models/types';

export const newsletterService = {
  async getNewsletters(): Promise<Newsletter[]> {
    console.log("Récupération des abonnés à la newsletter");
    return [];
  },
  
  async addNewsletter(newsletter: Omit<Newsletter, 'id' | 'createdAt'>): Promise<Newsletter> {
    console.log("Ajout d'un nouvel abonné à la newsletter:", newsletter);
    return {
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      ...newsletter
    };
  },
  
  async deleteNewsletter(id: string): Promise<boolean> {
    console.log("Désabonnement de la newsletter:", id);
    return true;
  }
};
