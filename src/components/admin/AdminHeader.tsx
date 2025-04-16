
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bell, 
  Calendar, 
  LayoutDashboard, 
  MessageCircle, 
  Settings2, 
  User, 
  X,
  CalendarPlus,
  UserPlus,
  BellRing
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

export function AdminHeader() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    { id: 1, type: "user", message: "Nouvel utilisateur inscrit: Marie Dupont", time: "Il y a 5 min", read: false },
    { id: 2, type: "message", message: "Nouveau message de contact", time: "Il y a 30 min", read: false }
  ]);
  const [events, setEvents] = useState([
    { id: 1, title: "Réunion équipe", time: "10:00" },
    { id: 2, title: "Lancement produit", time: "14:30" },
    { id: 3, title: "Revue design", time: "16:00" }
  ]);

  const currentDate = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      read: true
    }));
    setNotifications(updatedNotifications);
    toast({
      title: "Notifications marquées comme lues",
      description: "Toutes les notifications ont été marquées comme lues"
    });
  };

  const handleDismissNotification = (id: number) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée"
    });
  };

  const handleAddEvent = () => {
    // Simuler l'ajout d'un événement
    const newEvent = {
      id: events.length + 1,
      title: `Nouvel événement ${events.length + 1}`,
      time: "11:00"
    };
    setEvents([...events, newEvent]);
    toast({
      title: "Événement ajouté",
      description: `L'événement "${newEvent.title}" a été ajouté pour aujourd'hui à ${newEvent.time}`
    });
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "user": return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "message": return <MessageCircle className="h-4 w-4 text-green-500" />;
      default: return <BellRing className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="flex flex-col space-y-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-gray-500 flex items-center mt-1 hover:text-gray-700 transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                {currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Événements aujourd'hui</h3>
                <Button variant="outline" size="sm" onClick={handleAddEvent}>
                  <CalendarPlus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-auto">
                {events.map(event => (
                  <div key={event.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-sm text-gray-500">Aucun événement aujourd'hui</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">{unreadNotifications}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  Tout marquer comme lu
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune notification</p>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`flex items-start p-2 rounded-md ${notif.read ? "bg-white" : "bg-blue-50"}`}>
                      <div className="mr-2 mt-1">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.read ? "font-normal" : "font-medium"}`}>{notif.message}</p>
                        <p className="text-xs text-gray-500">{notif.time}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDismissNotification(notif.id)}>
                        <X className="h-3 w-3" />
                        <span className="sr-only">Fermer</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <h3 className="font-medium mb-2">Messages récents</h3>
              <p className="text-sm text-gray-500">Fonctionnalité à venir</p>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-1.5">
                <h3 className="font-medium">Paramètres rapides</h3>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Paramètres du profil
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Paramètres du site
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Préférences de sécurité
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer rounded-full hover:bg-gray-100 p-1 transition-colors">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={user?.username || "Admin"} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Sessions actives</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nouveaux utilisateurs</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Messages non lus</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Évènements aujourd'hui</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
