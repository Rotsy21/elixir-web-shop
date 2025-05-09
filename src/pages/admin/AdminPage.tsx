
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSearch } from "./components/AdminSearch";
import { AdminTabs } from "./components/AdminTabs";
import { AdminTabsContent } from "./components/AdminTabsContent";
import { useAdminData } from "./hooks/useAdminData";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import { logSecurityEvent } from "@/utils/securityUtils";

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

  useEffect(() => {
    if (user && isAdmin) {
      logSecurityEvent(`Utilisateur ${user.username} (${user.id}) a accédé au tableau de bord admin`, 'info', {
        userId: user.id,
        role: user.role,
        timestamp: new Date().toISOString()
      });
    }
    
    // Vérifier si les données sont vides
    const checkEmptyData = () => {
      if (isLoading) return;
      
      if (
        products.length === 0 && 
        users.length === 0 && 
        contacts.length === 0 &&
        newsletters.length === 0 &&
        orders.length === 0
      ) {
        toast.info("Aucune donnée disponible. Créez des comptes, contacts, newsletters et commandes pour les voir apparaître ici.");
      }
      
      // Afficher des informations sur les données chargées
      const dataStats = {
        produits: products.length,
        utilisateurs: users.length,
        contacts: contacts.length,
        newsletters: newsletters.length,
        commandes: orders.length
      };
      
      console.log("Données chargées dans le tableau de bord admin:", dataStats);
      
      if (contacts.length > 0) {
        console.log("Exemple de contact:", contacts[0]);
      }
      
      if (newsletters.length > 0) {
        console.log("Exemple de newsletter:", newsletters[0]);
      }
      
      if (orders.length > 0) {
        console.log("Exemple de commande:", orders[0]);
      }
    };
    
    checkEmptyData();
  }, [isLoading, products, users, contacts, newsletters, orders, user, isAdmin]);

  // Vérifier si l'utilisateur est admin, sinon rediriger
  if (!isAdmin) {
    toast.error("Vous n'avez pas les droits d'accès à cette page");
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
