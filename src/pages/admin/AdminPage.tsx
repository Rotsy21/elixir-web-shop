
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
} from "lucide-react";

// Import the refactored components
import { Dashboard } from "@/components/admin/Dashboard";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { UsersTable } from "@/components/admin/UsersTable";
import { ContactsTable } from "@/components/admin/ContactsTable";
import { NewslettersTable } from "@/components/admin/NewslettersTable";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

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

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tableau de bord Admin</h1>

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
              <ProductsTable products={products} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="users">
              <UsersTable users={users} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="contacts">
              <ContactsTable contacts={contacts} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="newsletters">
              <NewslettersTable newsletters={newsletters} isLoading={isLoading} />
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
