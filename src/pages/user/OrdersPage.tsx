import { useState } from "react";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Package, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/models/types";

export default function OrdersPage() {
  const { userOrders, isLoading } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return "secondary";
      case 'paid': return "default";
      case 'shipped': return "outline";
      case 'delivered': return "outline"; // "success" n'est pas supporté, doit être 'outline'
      case 'cancelled': return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return "En attente";
      case 'paid': return "Payé";
      case 'shipped': return "Expédié";
      case 'delivered': return "Livré";
      case 'cancelled': return "Annulé";
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-16 w-16 mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Connectez-vous pour voir vos commandes</h1>
          <p className="text-muted-foreground mb-6">Vous devez être connecté pour accéder à vos commandes</p>
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Mes Commandes</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : userOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
          <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande</p>
          <Button variant="outline" size="sm" onClick={() => navigate("/products")}>
            Découvrir nos produits
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En cours</TabsTrigger>
            <TabsTrigger value="completed">Livrées</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {userOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                isExpanded={expandedOrders.includes(order.id)} 
                toggleExpand={() => toggleOrderDetails(order.id)}
                getStatusBadgeVariant={getStatusBadgeVariant}
                getStatusLabel={getStatusLabel}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {userOrders
              .filter(order => ['pending', 'paid', 'shipped'].includes(order.status))
              .map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  isExpanded={expandedOrders.includes(order.id)} 
                  toggleExpand={() => toggleOrderDetails(order.id)}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getStatusLabel={getStatusLabel}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {userOrders
              .filter(order => order.status === 'delivered')
              .map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  isExpanded={expandedOrders.includes(order.id)} 
                  toggleExpand={() => toggleOrderDetails(order.id)}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getStatusLabel={getStatusLabel}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            {userOrders
              .filter(order => order.status === 'cancelled')
              .map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  isExpanded={expandedOrders.includes(order.id)} 
                  toggleExpand={() => toggleOrderDetails(order.id)}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getStatusLabel={getStatusLabel}
                />
              ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  isExpanded: boolean;
  toggleExpand: () => void;
  getStatusBadgeVariant: (status: Order['status']) => string;
  getStatusLabel: (status: Order['status']) => string;
}

function OrderCard({ 
  order, 
  isExpanded, 
  toggleExpand,
  getStatusBadgeVariant,
  getStatusLabel
}: OrderCardProps) {
  const dateFormatted = format(new Date(order.createdAt), "dd MMMM yyyy", { locale: fr });
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">
            Commande #{order.id.substring(0, 8)}
          </CardTitle>
          <CardDescription>
            {dateFormatted} · {order.items.reduce((total, item) => total + item.quantity, 0)} articles
          </CardDescription>
        </div>
        <Badge variant={getStatusBadgeVariant(order.status) as any}>
          {getStatusLabel(order.status)}
        </Badge>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex justify-between items-center">
          <p className="font-medium">Total: {order.totalAmount.toFixed(2)} €</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpand}
            className="flex items-center"
          >
            {isExpanded ? (
              <>
                <span className="mr-1">Masquer</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="mr-1">Détails</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Articles</h4>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-medium">
                    {(item.quantity * item.unitPrice).toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
            
            <h4 className="font-medium mt-4 mb-2">Adresse de livraison</h4>
            <address className="not-italic">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
              {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
              {order.shippingAddress.state}, {order.shippingAddress.country}
            </address>
            
            <div className="mt-4">
              <h4 className="font-medium mb-1">Méthode de paiement</h4>
              <p>{order.paymentMethod}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/40 flex justify-end">
        <Button variant="outline" size="sm">
          Assistance
        </Button>
      </CardFooter>
    </Card>
  );
}
