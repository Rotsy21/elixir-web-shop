
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSearch } from "./components/AdminSearch";
import { AdminTabs } from "./components/AdminTabs";
import { AdminTabsContent } from "./components/AdminTabsContent";
import { useAdminData } from "./hooks/useAdminData";
import { Tabs } from "@/components/ui/tabs";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Utiliser notre hook personnalisé pour gérer les données
  const {
    products,
    users,
    contacts,
    newsletters,
    orders,
    promotions,
    specialties,
    statistics,
    isLoading,
    filteredProducts,
    filteredUsers,
    filteredContacts,
    filteredNewsletters,
    filteredOrders,
    filteredPromotions,
    filteredSpecialties
  } = useAdminData(searchTerm);

  // Vérifier si l'utilisateur est admin, sinon rediriger
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
          
          <AdminSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <AdminTabsContent 
              activeTab={activeTab}
              isLoading={isLoading}
              products={products}
              filteredProducts={filteredProducts}
              users={users}
              filteredUsers={filteredUsers}
              contacts={contacts}
              filteredContacts={filteredContacts}
              newsletters={newsletters}
              filteredNewsletters={filteredNewsletters}
              orders={orders}
              filteredOrders={filteredOrders}
              promotions={promotions}
              filteredPromotions={filteredPromotions}
              specialties={specialties}
              filteredSpecialties={filteredSpecialties}
              statistics={statistics}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
