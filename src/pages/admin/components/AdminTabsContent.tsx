
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Product, User, ContactMessage, Newsletter, Order, Promotion, DeveloperSpecialty, SiteStatistics } from "@/models/types";
import { Dashboard } from "@/components/admin/Dashboard";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { UsersTable } from "@/components/admin/UsersTable";
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
  return (
    <Tabs value={activeTab} defaultValue={activeTab}>
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
  );
}
