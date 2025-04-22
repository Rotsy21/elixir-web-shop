
// Configuration MongoDB
export const MONGODB_CONFIG = {
  // Configuration pour MongoDB local
  localConnectionString: "mongodb://localhost:27017/elixir_drinks",
  
  // Paramètres de connexion détaillés
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Délai de connexion
    socketTimeoutMS: 45000, // Timeout socket
  },

  // Collections
  collections: {
    products: "products",
    users: "users",
    contacts: "contacts",
    newsletters: "newsletters",
    settings: "settings"
  }
};
