
import { TabsContent } from "@/components/ui/tabs";
import { Product, User, ContactMessage, Newsletter, Order, SiteStatistics } from "@/models/types";
import { Dashboard } from "@/components/admin/Dashboard";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { ContactsTable } from "@/components/admin/ContactsTable";
import { NewslettersTable } from "@/components/admin/NewslettersTable";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { StatisticsTable } from "@/components/admin/StatisticsTable";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { MongoDBConnector } from "@/components/admin/MongoDBConnector";
import { PostmanApiDocsComponent } from "@/components/admin/PostmanApiDocsComponent";

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
  statistics
}: AdminTabsContentProps) {
  return (
    <>
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
      
      <TabsContent value="statistics">
        <StatisticsTable statistics={statistics} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsForm />
      </TabsContent>
      
      <TabsContent value="database">
        <div className="space-y-8">
          <MongoDBConnector />
          <PostmanApiDocsComponent />
        </div>
      </TabsContent>
    </>
  );
}
