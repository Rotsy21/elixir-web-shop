
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bell, 
  Calendar, 
  LayoutDashboard, 
  MessageCircle, 
  Settings2, 
  User 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className="flex flex-col space-y-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
          <p className="text-gray-500 flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-2" />
            {currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">2</Badge>
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings2 className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
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
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
