
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Package,
  MessageSquare,
  Mail,
  Settings,
  Database,
  PackageOpen,
  Percent,
  Star
} from "lucide-react";

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <TabsList className="mb-8 bg-white p-1 rounded-md shadow-sm overflow-x-auto flex-nowrap">
      <TabsTrigger 
        value="dashboard" 
        onClick={() => handleTabChange("dashboard")} 
        data-state={activeTab === "dashboard" ? "active" : "inactive"}
        className={activeTab === "dashboard" ? "bg-primary text-white" : ""}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Tableau de bord
      </TabsTrigger>
      <TabsTrigger 
        value="products" 
        onClick={() => handleTabChange("products")}
        data-state={activeTab === "products" ? "active" : "inactive"}
        className={activeTab === "products" ? "bg-primary text-white" : ""}
      >
        <Package className="h-4 w-4 mr-2" />
        Produits
      </TabsTrigger>
      <TabsTrigger 
        value="users" 
        onClick={() => handleTabChange("users")}
        data-state={activeTab === "users" ? "active" : "inactive"}
        className={activeTab === "users" ? "bg-primary text-white" : ""}
      >
        <Users className="h-4 w-4 mr-2" />
        Utilisateurs
      </TabsTrigger>
      <TabsTrigger 
        value="contacts" 
        onClick={() => handleTabChange("contacts")}
        data-state={activeTab === "contacts" ? "active" : "inactive"}
        className={activeTab === "contacts" ? "bg-primary text-white" : ""}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Messages
      </TabsTrigger>
      <TabsTrigger 
        value="newsletters" 
        onClick={() => handleTabChange("newsletters")}
        data-state={activeTab === "newsletters" ? "active" : "inactive"}
        className={activeTab === "newsletters" ? "bg-primary text-white" : ""}
      >
        <Mail className="h-4 w-4 mr-2" />
        Newsletter
      </TabsTrigger>
      <TabsTrigger 
        value="orders" 
        onClick={() => handleTabChange("orders")}
        data-state={activeTab === "orders" ? "active" : "inactive"}
        className={activeTab === "orders" ? "bg-primary text-white" : ""}
      >
        <PackageOpen className="h-4 w-4 mr-2" />
        Commandes
      </TabsTrigger>
      <TabsTrigger 
        value="promotions" 
        onClick={() => handleTabChange("promotions")}
        data-state={activeTab === "promotions" ? "active" : "inactive"}
        className={activeTab === "promotions" ? "bg-primary text-white" : ""}
      >
        <Percent className="h-4 w-4 mr-2" />
        Promotions
      </TabsTrigger>
      <TabsTrigger 
        value="specialties" 
        onClick={() => handleTabChange("specialties")}
        data-state={activeTab === "specialties" ? "active" : "inactive"}
        className={activeTab === "specialties" ? "bg-primary text-white" : ""}
      >
        <Star className="h-4 w-4 mr-2" />
        Spécialités
      </TabsTrigger>
      <TabsTrigger 
        value="statistics" 
        onClick={() => handleTabChange("statistics")}
        data-state={activeTab === "statistics" ? "active" : "inactive"}
        className={activeTab === "statistics" ? "bg-primary text-white" : ""}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Statistiques
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        onClick={() => handleTabChange("settings")}
        data-state={activeTab === "settings" ? "active" : "inactive"}
        className={activeTab === "settings" ? "bg-primary text-white" : ""}
      >
        <Settings className="h-4 w-4 mr-2" />
        Paramètres
      </TabsTrigger>
      <TabsTrigger 
        value="database" 
        onClick={() => handleTabChange("database")}
        data-state={activeTab === "database" ? "active" : "inactive"}
        className={activeTab === "database" ? "bg-primary text-white" : ""}
      >
        <Database className="h-4 w-4 mr-2" />
        Base de données
      </TabsTrigger>
    </TabsList>
  );
}
