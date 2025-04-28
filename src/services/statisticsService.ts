
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { SiteStatistics } from '@/models/types';
import { logSecurityEvent } from '@/utils/securityUtils';

/**
 * Service pour gérer les statistiques du site dans MongoDB
 */
export const statisticsService = {
  /**
   * Obtient les statistiques du site
   */
  getAllStatistics: async (): Promise<SiteStatistics[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        
        // Données simulées pour la démonstration
        const today = new Date();
        
        // Statistiques journalières sur 7 jours
        const dailyStats: SiteStatistics[] = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          return {
            totalUsers: 100 + Math.floor(Math.random() * 10),
            totalProducts: 50 + Math.floor(Math.random() * 5),
            totalOrders: 15 - i + Math.floor(Math.random() * 5),
            totalRevenue: 1200 - (i * 50) + Math.floor(Math.random() * 200),
            activeUsers: 80 - (i * 3) + Math.floor(Math.random() * 10),
            conversionRate: 2.5 + (Math.random() * 1.5),
            averageOrderValue: 75 + Math.floor(Math.random() * 15),
            period: 'daily',
            date: date.toISOString()
          };
        });
        
        // Statistiques hebdomadaires sur 4 semaines
        const weeklyStats: SiteStatistics[] = Array.from({ length: 4 }).map((_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (i * 7));
          
          return {
            totalUsers: 120 + (i * 5) + Math.floor(Math.random() * 10),
            totalProducts: 50 + Math.floor(Math.random() * 5),
            totalOrders: 100 - (i * 5) + Math.floor(Math.random() * 10),
            totalRevenue: 7500 - (i * 250) + Math.floor(Math.random() * 500),
            activeUsers: 350 - (i * 15) + Math.floor(Math.random() * 30),
            conversionRate: 3.2 - (i * 0.2) + (Math.random() * 0.8),
            averageOrderValue: 80 - (i * 2) + Math.floor(Math.random() * 10),
            period: 'weekly',
            date: date.toISOString()
          };
        });
        
        // Statistiques mensuelles sur 6 mois
        const monthlyStats: SiteStatistics[] = Array.from({ length: 6 }).map((_, i) => {
          const date = new Date(today);
          date.setMonth(date.getMonth() - i);
          
          return {
            totalUsers: 500 + (i * 20) + Math.floor(Math.random() * 50),
            totalProducts: 50 + (i * 2) + Math.floor(Math.random() * 5),
            totalOrders: 450 - (i * 20) + Math.floor(Math.random() * 30),
            totalRevenue: 32000 - (i * 1200) + Math.floor(Math.random() * 2000),
            activeUsers: 1200 - (i * 50) + Math.floor(Math.random() * 100),
            conversionRate: 3.8 - (i * 0.1) + (Math.random() * 0.5),
            averageOrderValue: 85 - (i * 1) + Math.floor(Math.random() * 8),
            period: 'monthly',
            date: date.toISOString()
          };
        });
        
        // Statistiques annuelles sur 3 ans
        const yearlyStats: SiteStatistics[] = Array.from({ length: 3 }).map((_, i) => {
          const date = new Date(today);
          date.setFullYear(date.getFullYear() - i);
          
          return {
            totalUsers: 2000 + (i * 500) + Math.floor(Math.random() * 200),
            totalProducts: 60 + (i * 10) + Math.floor(Math.random() * 5),
            totalOrders: 5200 - (i * 400) + Math.floor(Math.random() * 100),
            totalRevenue: 420000 - (i * 35000) + Math.floor(Math.random() * 10000),
            activeUsers: 15000 - (i * 1000) + Math.floor(Math.random() * 500),
            conversionRate: 4.2 - (i * 0.3) + (Math.random() * 0.4),
            averageOrderValue: 90 - (i * 2) + Math.floor(Math.random() * 5),
            period: 'yearly',
            date: date.toISOString()
          };
        });
        
        return [...dailyStats, ...weeklyStats, ...monthlyStats, ...yearlyStats];
      }
      
      console.log("Récupération des statistiques depuis MongoDB");
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      logSecurityEvent("Erreur de récupération des statistiques", "error", { error });
      throw error;
    }
  },

  /**
   * Obtient les statistiques par période
   */
  getStatisticsByPeriod: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<SiteStatistics[]> => {
    try {
      const allStats = await statisticsService.getAllStatistics();
      return allStats.filter(stat => stat.period === period);
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques ${period}:`, error);
      logSecurityEvent(`Erreur de récupération des statistiques ${period}`, "error", { error });
      throw error;
    }
  },

  /**
   * Sauvegarde de nouvelles statistiques 
   * (utilisé uniquement côté admin)
   */
  saveStatistics: async (statistics: Omit<SiteStatistics, 'id'>): Promise<SiteStatistics> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Les statistiques n'ont pas été sauvegardées.");
        throw new Error("MongoDB non connecté");
      }
      
      console.log("Sauvegarde des statistiques dans MongoDB:", statistics);
      
      return {
        ...statistics,
        id: crypto.randomUUID()
      } as SiteStatistics;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des statistiques:", error);
      logSecurityEvent("Erreur de sauvegarde des statistiques", "error", { error });
      throw error;
    }
  }
};
