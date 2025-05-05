
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { SiteStatistics } from '@/models/types';
import { logSecurityEvent } from '@/utils/securityUtils';

/**
 * Service pour gérer les statistiques dans MongoDB
 */
export const statisticsService = {
  /**
   * Obtient toutes les statistiques
   */
  getAllStatistics: async (): Promise<SiteStatistics[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        // Retourner des statistiques simulées
        return [{
          totalUsers: 125,
          totalProducts: 78,
          totalOrders: 350,
          totalRevenue: 12500,
          activeUsers: 85,
          conversionRate: 3.2,
          averageOrderValue: 35.71,
          period: 'monthly',
          date: new Date()
        }];
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
   * Obtient les statistiques pour une période donnée
   */
  getStatisticsByPeriod: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<SiteStatistics[]> => {
    try {
      if (!MONGODB_CONFIG.isConnected) {
        console.warn("MongoDB non connecté. Utilisation des données simulées.");
        return [{
          totalUsers: 125,
          totalProducts: 78,
          totalOrders: 350,
          totalRevenue: 12500,
          activeUsers: 85,
          conversionRate: 3.2,
          averageOrderValue: 35.71,
          period: period,
          date: new Date()
        }];
      }
      
      console.log(`Récupération des statistiques pour la période ${period} depuis MongoDB`);
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques pour ${period}:`, error);
      logSecurityEvent("Erreur de récupération des statistiques", "error", { error, period });
      throw error;
    }
  }
};
