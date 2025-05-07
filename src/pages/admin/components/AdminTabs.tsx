
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
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        className={activeTab === "dashboard" ? "bg-primary text-white" : ""}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Tableau de bord
      </TabsTrigger>
      <TabsTrigger 
        value="products" 
        className={activeTab === "products" ? "bg-primary text-white" : ""}
      >
        <Package className="h-4 w-4 mr-2" />
        Produits
      </TabsTrigger>
      <TabsTrigger 
        value="users" 
        className={activeTab === "users" ? "bg-primary text-white" : ""}
      >
        <Users className="h-4 w-4 mr-2" />
        Utilisateurs
      </TabsTrigger>
      <TabsTrigger 
        value="contacts" 
        className={activeTab === "contacts" ? "bg-primary text-white" : ""}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Messages
      </TabsTrigger>
      <TabsTrigger 
        value="newsletters" 
        className={activeTab === "newsletters" ? "bg-primary text-white" : ""}
      >
        <Mail className="h-4 w-4 mr-2" />
        Newsletter
      </TabsTrigger>
      <TabsTrigger 
        value="orders" 
        className={activeTab === "orders" ? "bg-primary text-white" : ""}
      >
        <PackageOpen className="h-4 w-4 mr-2" />
        Commandes
      </TabsTrigger>
      <TabsTrigger 
        value="promotions" 
        className={activeTab === "promotions" ? "bg-primary text-white" : ""}
      >
        <Percent className="h-4 w-4 mr-2" />
        Promotions
      </TabsTrigger>
      <TabsTrigger 
        value="specialties" 
        className={activeTab === "specialties" ? "bg-primary text-white" : ""}
      >
        <Star className="h-4 w-4 mr-2" />
        Spécialités
      </TabsTrigger>
      <TabsTrigger 
        value="statistics" 
        className={activeTab === "statistics" ? "bg-primary text-white" : ""}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Statistiques
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        className={activeTab === "settings" ? "bg-primary text-white" : ""}
      >
        <Settings className="h-4 w-4 mr-2" />
        Paramètres
      </TabsTrigger>
      <TabsTrigger 
        value="database" 
        className={activeTab === "database" ? "bg-primary text-white" : ""}
      >
        <Database className="h-4 w-4 mr-2" />
        Base de données
      </TabsTrigger>
    </TabsList>
  );
}
