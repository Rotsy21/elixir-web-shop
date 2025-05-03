
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
import { useState } from "react";

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
  return (
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
    </Tabs>
  );
}
