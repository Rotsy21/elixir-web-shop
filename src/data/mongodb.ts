
// Configuration et utilitaires MongoDB pour l'application Elixir Drinks
import { Product, User, ContactMessage, Newsletter } from "@/models/types";

// Configuration MongoDB
export const MONGODB_CONFIG = {
  // Pour MongoDB local (MongoDB Compass)
  localConnectionString: "mongodb://localhost:27017/elixir_drinks",
  
  // Pour MongoDB Atlas (remplacer avec vos identifiants)
  atlasConnectionString: "mongodb+srv://<username>:<password>@cluster0.mongodb.net/elixir_drinks",

  // Collections
  collections: {
    products: "products",
    users: "users",
    contacts: "contacts",
    newsletters: "newsletters",
    settings: "settings"
  }
};

// Classe utilitaire pour communiquer avec MongoDB
class MongoDBService {
  private static instance: MongoDBService;
  private isConnected: boolean = false;
  private connectionError: string | null = null;
  private connectionString: string = "";
  
  // Singleton pattern
  private constructor() {}
  
  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  // Se connecter à MongoDB (local ou Atlas)
  public async connect(useAtlas: boolean = false, customConnectionString?: string): Promise<boolean> {
    try {
      // Utiliser une chaîne de connexion personnalisée si fournie
      if (customConnectionString) {
        this.connectionString = customConnectionString;
      } else {
        this.connectionString = useAtlas 
          ? MONGODB_CONFIG.atlasConnectionString 
          : MONGODB_CONFIG.localConnectionString;
      }
      
      console.log(`Tentative de connexion à MongoDB avec: ${this.connectionString}`);
      
      // Simulation réussie pour développement
      // Dans une vraie application, ceci utiliserait le client MongoDB pour établir une connexion
      // Exemple: 
      // const client = await MongoClient.connect(this.connectionString);
      // this.db = client.db();
      
      this.isConnected = true;
      this.connectionError = null;
      console.log('Connecté à MongoDB avec succès');
      
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la connexion à MongoDB:', error);
      this.isConnected = false;
      this.connectionError = error?.message || "Erreur de connexion inconnue";
      return false;
    }
  }

  // Vérifier l'état de la connexion
  public getConnectionStatus(): { isConnected: boolean; error: string | null; connectionString: string } {
    return {
      isConnected: this.isConnected,
      error: this.connectionError,
      connectionString: this.connectionString
    };
  }

  // Vérifier la connexion
  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }

  // Méthodes génériques CRUD avec typage fort
  public async find<T>(collection: string, query: object = {}): Promise<T[]> {
    if (!this.isConnected) await this.connect();
    
    console.log(`Recherche dans la collection ${collection} avec la requête:`, query);
    // Dans un vrai backend, cela exécuterait une requête MongoDB
    // Pour l'instant, nous simulons la réponse
    return [] as T[];
  }

  public async findOne<T>(collection: string, query: object): Promise<T | null> {
    if (!this.isConnected) await this.connect();
    
    console.log(`Recherche d'un document dans la collection ${collection} avec la requête:`, query);
    // Simulation
    return null as T | null;
  }

  public async insertOne<T>(collection: string, document: T): Promise<{ id: string, success: boolean }> {
    if (!this.isConnected) await this.connect();
    
    console.log(`Insertion dans la collection ${collection} du document:`, document);
    // Génération d'un ID simulé
    const id = Math.random().toString(36).substring(2, 15);
    return { id, success: true };
  }

  public async updateOne<T>(collection: string, id: string, update: Partial<T>): Promise<boolean> {
    if (!this.isConnected) await this.connect();
    
    console.log(`Mise à jour dans la collection ${collection} pour l'ID ${id} avec:`, update);
    return true;
  }

  public async deleteOne(collection: string, id: string): Promise<boolean> {
    if (!this.isConnected) await this.connect();
    
    console.log(`Suppression dans la collection ${collection} de l'ID ${id}`);
    return true;
  }

  // Méthodes spécifiques par entités
  // Products
  public async getProducts(query: object = {}): Promise<Product[]> {
    return this.find<Product>(MONGODB_CONFIG.collections.products, query);
  }

  public async getProduct(id: string): Promise<Product | null> {
    return this.findOne<Product>(MONGODB_CONFIG.collections.products, { id });
  }

  public async addProduct(product: Product): Promise<{ id: string, success: boolean }> {
    return this.insertOne<Product>(MONGODB_CONFIG.collections.products, product);
  }

  public async updateProduct(id: string, update: Partial<Product>): Promise<boolean> {
    return this.updateOne<Product>(MONGODB_CONFIG.collections.products, id, update);
  }

  public async deleteProduct(id: string): Promise<boolean> {
    return this.deleteOne(MONGODB_CONFIG.collections.products, id);
  }

  // Users
  public async getUsers(query: object = {}): Promise<User[]> {
    return this.find<User>(MONGODB_CONFIG.collections.users, query);
  }

  public async getUser(id: string): Promise<User | null> {
    return this.findOne<User>(MONGODB_CONFIG.collections.users, { id });
  }

  public async addUser(user: User): Promise<{ id: string, success: boolean }> {
    return this.insertOne<User>(MONGODB_CONFIG.collections.users, user);
  }

  public async updateUser(id: string, update: Partial<User>): Promise<boolean> {
    return this.updateOne<User>(MONGODB_CONFIG.collections.users, id, update);
  }

  public async deleteUser(id: string): Promise<boolean> {
    return this.deleteOne(MONGODB_CONFIG.collections.users, id);
  }

  // Contacts
  public async getContacts(query: object = {}): Promise<ContactMessage[]> {
    return this.find<ContactMessage>(MONGODB_CONFIG.collections.contacts, query);
  }

  public async getContact(id: string): Promise<ContactMessage | null> {
    return this.findOne<ContactMessage>(MONGODB_CONFIG.collections.contacts, { id });
  }

  public async addContact(contact: ContactMessage): Promise<{ id: string, success: boolean }> {
    return this.insertOne<ContactMessage>(MONGODB_CONFIG.collections.contacts, contact);
  }

  public async updateContact(id: string, update: Partial<ContactMessage>): Promise<boolean> {
    return this.updateOne<ContactMessage>(MONGODB_CONFIG.collections.contacts, id, update);
  }

  public async deleteContact(id: string): Promise<boolean> {
    return this.deleteOne(MONGODB_CONFIG.collections.contacts, id);
  }

  // Newsletters
  public async getNewsletters(query: object = {}): Promise<Newsletter[]> {
    return this.find<Newsletter>(MONGODB_CONFIG.collections.newsletters, query);
  }

  public async getNewsletter(id: string): Promise<Newsletter | null> {
    return this.findOne<Newsletter>(MONGODB_CONFIG.collections.newsletters, { id });
  }

  public async addNewsletter(newsletter: Newsletter): Promise<{ id: string, success: boolean }> {
    return this.insertOne<Newsletter>(MONGODB_CONFIG.collections.newsletters, newsletter);
  }

  public async updateNewsletter(id: string, update: Partial<Newsletter>): Promise<boolean> {
    return this.updateOne<Newsletter>(MONGODB_CONFIG.collections.newsletters, id, update);
  }

  public async deleteNewsletter(id: string): Promise<boolean> {
    return this.deleteOne(MONGODB_CONFIG.collections.newsletters, id);
  }
}

// Créer une instance du service
export const mongodbService = MongoDBService.getInstance();

// Exporter les fonctions utilitaires pour l'usage dans l'application
export const mongodbHelpers = {
  // Products
  getProducts: (query = {}) => mongodbService.getProducts(query),
  getProduct: (id: string) => mongodbService.getProduct(id),
  addProduct: (product: Product) => mongodbService.addProduct(product),
  updateProduct: (id: string, update: Partial<Product>) => mongodbService.updateProduct(id, update),
  deleteProduct: (id: string) => mongodbService.deleteProduct(id),

  // Users
  getUsers: (query = {}) => mongodbService.getUsers(query),
  getUser: (id: string) => mongodbService.getUser(id),
  addUser: (user: User) => mongodbService.addUser(user),
  updateUser: (id: string, update: Partial<User>) => mongodbService.updateUser(id, update),
  deleteUser: (id: string) => mongodbService.deleteUser(id),

  // Contacts
  getContacts: (query = {}) => mongodbService.getContacts(query),
  getContact: (id: string) => mongodbService.getContact(id),
  addContact: (contact: ContactMessage) => mongodbService.addContact(contact),
  updateContact: (id: string, update: Partial<ContactMessage>) => mongodbService.updateContact(id, update),
  deleteContact: (id: string) => mongodbService.deleteContact(id),

  // Newsletters
  getNewsletters: (query = {}) => mongodbService.getNewsletters(query),
  getNewsletter: (id: string) => mongodbService.getNewsletter(id),
  addNewsletter: (newsletter: Newsletter) => mongodbService.addNewsletter(newsletter),
  updateNewsletter: (id: string, update: Partial<Newsletter>) => mongodbService.updateNewsletter(id, update),
  deleteNewsletter: (id: string) => mongodbService.deleteNewsletter(id),
  
  // Connexion à la base de données
  connect: async (useAtlas = false, customConnectionString?: string) => {
    return mongodbService.connect(useAtlas, customConnectionString);
  },
  
  // Vérification de la connexion
  isConnected: () => {
    return mongodbService.isConnectedToDatabase();
  },
  
  // Obtenir l'état détaillé de la connexion
  getConnectionStatus: () => {
    return mongodbService.getConnectionStatus();
  }
};

// Ajouter un composant pour configurer la connexion MongoDB
export function useMongoDBConnection() {
  return {
    connect: mongodbHelpers.connect,
    getStatus: mongodbHelpers.getConnectionStatus,
    isConnected: mongodbHelpers.isConnected
  };
}
