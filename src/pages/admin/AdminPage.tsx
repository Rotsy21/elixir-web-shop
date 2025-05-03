
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getProducts, 
  getUsers, 
  getContacts, 
  getNewsletters 
} from "@/data/mockData";
import { 
  Product, 
  User, 
  ContactMessage, 
  Newsletter, 
  Order,
  Promotion,
  DeveloperSpecialty,
  SiteStatistics
} from "@/models/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Package,
  MessageSquare,
  Mail,
  Settings,
  Search,
  Database,
  PackageOpen,
  Percent,
  Star
} from "lucide-react";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { orderService } from "@/services/orderService";
import { Dashboard } from "@/components/admin/Dashboard";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { UsersTable } from "@/components/admin/UsersTable";
import { ContactsTable } from "@/components/admin/ContactsTable";
import { NewslettersTable } from "@/components/admin/NewslettersTable";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { MongoDBConnector } from "@/components/admin/MongoDBConnector";
// Import PromotionsTable avec le bon chemin
import { PromotionsTable } from "@/components/admin/PromotionsTable";
import { SpecialtiesTable } from "@/components/admin/SpecialtiesTable";
import { StatisticsTable } from "@/components/admin/StatisticsTable";
import { Input } from "@/components/ui/input";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { applySecurityHeaders } from "@/utils/securityMiddleware";
import { promotionService } from "@/services/promotionService";
import { developerSpecialtyService } from "@/services/developerSpecialtyService";
import { statisticsService } from "@/services/statisticsService";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [specialties, setSpecialties] = useState<DeveloperSpecialty[]>([]);
  const [statistics, setStatistics] = useState<SiteStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Vérifions d'abord si l'utilisateur est admin, sinon rediriger
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    // Appliquer les en-têtes de sécurité
    applySecurityHeaders();
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          productsData, 
          usersData, 
          contactsData, 
          newslettersData, 
          ordersData,
          promotionsData,
          specialtiesData,
          statisticsData
        ] = await Promise.all([
          getProducts(),
          getUsers(),
          getContacts(),
          getNewsletters(),
          orderService.getAllOrders(),
          promotionService.getAllPromotions(),
          developerSpecialtyService.getAllSpecialties(),
          statisticsService.getAllStatistics(),
        ]);
        
        setProducts(productsData);
        setUsers(usersData);
        setContacts(contactsData);
        setNewsletters(newslettersData);
        setOrders(ordersData);
        setPromotions(promotionsData);
        setSpecialties(specialtiesData);
        setStatistics(statisticsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données admin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les produits en fonction du terme de recherche
  const filteredProducts = searchTerm 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;
  
  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = searchTerm
    ? users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  // Filtrer les messages de contact en fonction du terme de recherche
  const filteredContacts = searchTerm
    ? contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : contacts;

  // Filtrer les newsletters en fonction du terme de recherche
  const filteredNewsletters = searchTerm
    ? newsletters.filter(n => 
        n.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : newsletters;

  // Filtrer les commandes en fonction du terme de recherche
  const filteredOrders = searchTerm
    ? orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orders;

  // Filtrer les promotions en fonction du terme de recherche
  const filteredPromotions = searchTerm
    ? promotions.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.couponCode && p.couponCode.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : promotions;
    
  // Filtrer les spécialités en fonction du terme de recherche
  const filteredSpecialties = searchTerm
    ? specialties.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : specialties;

  // Les statistiques n'ont pas besoin d'être filtrées car elles sont affichées différemment

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
          <MongoDBConnector />
          <div className="flex items-center mb-6">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans tous les tableaux..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 bg-white p-1 rounded-md shadow-sm overflow-x-auto flex-nowrap">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Tableau de bord
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Package className="h-4 w-4 mr-2" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="newsletters" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Mail className="h-4 w-4 mr-2" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <PackageOpen className="h-4 w-4 mr-2" />
                Commandes
              </TabsTrigger>
              <TabsTrigger value="promotions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Percent className="h-4 w-4 mr-2" />
                Promotions
              </TabsTrigger>
              <TabsTrigger value="specialties" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Star className="h-4 w-4 mr-2" />
                Spécialités
              </TabsTrigger>
              <TabsTrigger value="statistics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </TabsTrigger>
              <TabsTrigger value="database" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Database className="h-4 w-4 mr-2" />
                Base de données
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <Dashboard 
                products={products} 
                users={users} 
                contacts={contacts} 
                newsletters={newsletters} 
              />
            </TabsContent>
            
            <TabsContent value="products">
              <ProductsTable products={filteredProducts} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersTable users={filteredUsers} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="contacts">
              <ContactsTable contacts={filteredContacts} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="newsletters">
              <NewslettersTable newsletters={filteredNewsletters} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrdersTable orders={filteredOrders} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="promotions">
              <PromotionsTable promotions={filteredPromotions} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="specialties">
              <SpecialtiesTable specialties={filteredSpecialties} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="statistics">
              <StatisticsTable statistics={statistics} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsForm />
            </TabsContent>
            
            <TabsContent value="database">
              <MongoDBConnector />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
