
export interface ConnectionStatus {
  isConnected: boolean;
  connectionString: string;
  error: string | null;
}

export interface MongoDBState {
  isConnected: boolean;
  connectionString: string;
  connectionError: string | null;
  client: any | null;
}
