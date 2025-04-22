
import { useState, useCallback } from 'react';
import { ConnectionStatus, MongoDBState } from '@/types/mongoTypes';
import { MONGODB_CONFIG } from '@/config/mongoConfig';

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
      
      mongoState.isConnected = true;
      mongoState.connectionString = connString;
      mongoState.connectionError = null;
      
      setStatus({
        isConnected: true,
        connectionString: connString,
        error: null
      });
      
      return true;
    } catch (error) {
      console.error("Erreur de connexion à MongoDB:", error);
      
      mongoState.isConnected = false;
      mongoState.connectionError = error instanceof Error ? error.message : "Erreur inconnue";
      
      setStatus({
        isConnected: false,
        connectionString: mongoState.connectionString,
        error: mongoState.connectionError
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
