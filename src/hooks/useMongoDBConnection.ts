
import { useState, useCallback } from 'react';
import { ConnectionStatus, MongoDBState } from '@/types/mongoTypes';
import { MONGODB_CONFIG } from '@/config/mongoConfig';
import { toast } from "@/hooks/use-toast";

// État global de la connexion MongoDB
const mongoState: MongoDBState = {
  isConnected: false,
  connectionString: '',
  connectionError: null,
  client: null
};

export const useMongoDBConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: mongoState.isConnected,
    connectionString: mongoState.connectionString,
    error: mongoState.connectionError
  });

  const connect = useCallback(async (isAtlas: boolean = false, customConnString?: string) => {
    try {
      const connString = customConnString || 
        (isAtlas ? '' : MONGODB_CONFIG.localConnectionString);
      
      if (!connString) {
        throw new Error("Chaîne de connexion vide");
      }
      
      console.log(`Tentative de connexion à MongoDB: ${connString}`);
      
      // Simulation de la connexion à MongoDB (dans une application réelle, cela utiliserait une API ou un service)
      // Dans une application web, MongoDB doit être accessible via un serveur backend
      const simulateConnection = () => new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Dans une application réelle, il faudrait vérifier si MongoDB est réellement accessible
          if (connString.includes("localhost") || connString.includes("mongodb+srv")) {
            resolve();
          } else {
            reject(new Error("Format de chaîne de connexion invalide"));
          }
        }, 1000);
      });

      await simulateConnection();
      
      // Mettre à jour l'état de connexion
      mongoState.isConnected = true;
      mongoState.connectionString = connString;
      mongoState.connectionError = null;
      
      // Mettre à jour l'indicateur dans la configuration
      MONGODB_CONFIG.isConnected = true;
      
      setStatus({
        isConnected: true,
        connectionString: connString,
        error: null
      });
      
      toast({
        title: "Connexion à MongoDB réussie",
        description: "Vous pouvez maintenant stocker et récupérer des données.",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur de connexion à MongoDB:", error);
      
      mongoState.isConnected = false;
      mongoState.connectionError = error instanceof Error ? error.message : "Erreur inconnue";
      
      // Mettre à jour l'indicateur dans la configuration
      MONGODB_CONFIG.isConnected = false;
      
      setStatus({
        isConnected: false,
        connectionString: mongoState.connectionString,
        error: mongoState.connectionError
      });
      
      toast({
        title: "Erreur de connexion à MongoDB",
        description: mongoState.connectionError,
        variant: "destructive",
      });
      
      return false;
    }
  }, []);

  const getStatus = useCallback(() => {
    return {
      isConnected: mongoState.isConnected,
      connectionString: mongoState.connectionString,
      error: mongoState.connectionError
    };
  }, []);

  return { connect, getStatus, isConnected: mongoState.isConnected };
};
