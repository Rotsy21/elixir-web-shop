
export const MONGODB_CONFIG = {
  localConnectionString: "mongodb://localhost:27017/elixir_drinks",
  isConnected: false, // Nouvel indicateur pour suivre l'état de la connexion
  
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },

  collections: {
    products: "products",
    users: "users",
    contacts: "contacts",
    newsletters: "newsletters",
    settings: "settings"
  }
};
