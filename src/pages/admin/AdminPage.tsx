
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts, getUsers, getContacts, getNewsletters } from "@/data/mockData";
import { Product, User, ContactMessage, Newsletter } from "@/models/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Package,
  MessageSquare,
  Mail,
  Settings,
  Search,
} from "lucide-react";

// Import the refactored components
import { Dashboard } from "@/components/admin/Dashboard";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { UsersTable } from "@/components/admin/UsersTable";
import { ContactsTable } from "@/components/admin/ContactsTable";
import { NewslettersTable } from "@/components/admin/NewslettersTable";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Input } from "@/components/ui/input";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // If not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, usersData, contactsData, newslettersData] = await Promise.all([
          getProducts(),
          getUsers(),
          getContacts(),
          getNewsletters(),
        ]);

        setProducts(productsData);
        setUsers(usersData);
        setContacts(contactsData);
        setNewsletters(newslettersData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search term
  const filteredProducts = searchTerm 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;
  
  const filteredUsers = searchTerm
    ? users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  const filteredContacts = searchTerm
    ? contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : contacts;

  const filteredNewsletters = searchTerm
    ? newsletters.filter(n => 
        n.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : newsletters;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
          
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
            <TabsList className="mb-8 bg-white p-1 rounded-md shadow-sm">
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
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
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

            <TabsContent value="settings">
              <SettingsForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
