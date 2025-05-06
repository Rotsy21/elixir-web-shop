
import { TabsContent } from "@/components/ui/tabs";
import { Product, User, ContactMessage, Newsletter, Order, Promotion, DeveloperSpecialty, SiteStatistics } from "@/models/types";
import { Dashboard } from "@/components/admin/Dashboard";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { ContactsTable } from "@/components/admin/ContactsTable";
import { NewslettersTable } from "@/components/admin/NewslettersTable";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { PromotionsTable } from "@/components/admin/PromotionsTable";
import { SpecialtiesTable } from "@/components/admin/SpecialtiesTable";
import { StatisticsTable } from "@/components/admin/StatisticsTable";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { MongoDBConnector } from "@/components/admin/MongoDBConnector";

interface AdminTabsContentProps {
  activeTab: string;
  isLoading: boolean;
  products: Product[];
  filteredProducts: Product[];
  users: User[];
  filteredUsers: User[];
  contacts: ContactMessage[];
  filteredContacts: ContactMessage[];
  newsletters: Newsletter[];
  filteredNewsletters: Newsletter[];
  orders: Order[];
  filteredOrders: Order[];
  promotions: Promotion[];
  filteredPromotions: Promotion[];
  specialties: DeveloperSpecialty[];
  filteredSpecialties: DeveloperSpecialty[];
  statistics: SiteStatistics[];
}

export function AdminTabsContent({
  activeTab,
  isLoading,
  products,
  filteredProducts,
  users,
  filteredUsers,
  contacts,
  filteredContacts,
  newsletters,
  filteredNewsletters,
  orders,
  filteredOrders,
  promotions,
  filteredPromotions,
  specialties,
  filteredSpecialties,
  statistics
}: AdminTabsContentProps) {
  // On renvoie directement le contenu basé sur l'onglet actif
  if (activeTab === "dashboard") {
    return (
      <Dashboard 
        products={products} 
        users={users} 
        contacts={contacts} 
        newsletters={newsletters} 
      />
    );
  }
  
  if (activeTab === "products") {
    return <ProductsTable products={filteredProducts} isLoading={isLoading} />;
  }
  
  if (activeTab === "users") {
    return <UsersTable users={filteredUsers} isLoading={isLoading} />;
  }
  
  if (activeTab === "contacts") {
    return <ContactsTable contacts={filteredContacts} isLoading={isLoading} />;
  }
  
  if (activeTab === "newsletters") {
    return <NewslettersTable newsletters={filteredNewsletters} isLoading={isLoading} />;
  }
  
  if (activeTab === "orders") {
    return <OrdersTable orders={filteredOrders} isLoading={isLoading} />;
  }
  
  if (activeTab === "promotions") {
    return <PromotionsTable promotions={filteredPromotions} isLoading={isLoading} />;
  }
  
  if (activeTab === "specialties") {
    return <SpecialtiesTable specialties={filteredSpecialties} isLoading={isLoading} />;
  }
  
  if (activeTab === "statistics") {
    return <StatisticsTable statistics={statistics} isLoading={isLoading} />;
  }
  
  if (activeTab === "settings") {
    return <SettingsForm />;
  }
  
  if (activeTab === "database") {
    return <MongoDBConnector />;
  }
  
  return null;
}
