
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { Order } from "@/models/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, Package, ShoppingBag, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, getOrdersByUserId } = useOrder();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const orders = await getOrdersByUserId(user.id);
        // Tri des commandes par date, les plus récentes en premier
        const sortedOrders = [...orders].sort((a, b) => {
          if (a.date && b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          return 0;
        });
        setUserOrders(sortedOrders);
      }
    };

    fetchOrders();
  }, [user, getOrdersByUserId]);

  // Filtrer les commandes en fonction de l'onglet actif
  const filteredOrders = userOrders.filter(order => {
    if (activeTab === "all") return true;
    if (activeTab === "processing") return order.status === "pending" || order.status === "processing";
    return order.status === activeTab;
  });

  const getStatusClassName = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-indigo-100 text-indigo-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "paid":
        return "Payée";
      case "processing":
        return "En traitement";
      case "shipped":
        return "Expédiée";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch (error) {
      return "Date invalide";
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Vous devez être connecté</CardTitle>
            <CardDescription>
              Veuillez vous connecter pour voir vos commandes
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>

      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="processing">En cours</TabsTrigger>
          <TabsTrigger value="shipped">Expédiées</TabsTrigger>
          <TabsTrigger value="delivered">Livrées</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <div className="text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Aucune commande trouvée</h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === "all" 
                      ? "Vous n'avez pas encore passé de commande." 
                      : `Vous n'avez pas de commande avec le statut "${getStatusLabel(activeTab)}".`}
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = "/products"}>
                    Parcourir les produits
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="border-b pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">
                          Commande #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription>
                          Passée le {order.date ? getFormattedDate(order.date) : "Date inconnue"}
                        </CardDescription>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClassName(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="items">
                        <AccordionTrigger className="py-2">
                          <span className="flex items-center">
                            <Package className="mr-2 h-4 w-4" /> 
                            Articles de la commande ({order.items.length})
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div 
                                key={index} 
                                className="flex items-center justify-between py-2 border-b last:border-0"
                              >
                                <div className="flex items-center">
                                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                                    {item.imageUrl ? (
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.productId} 
                                        className="w-full h-full object-cover" 
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{item.productId}</p>
                                    <p className="text-sm text-gray-500">
                                      Quantité: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{item.quantity} x {(parseFloat(item.price) || 0).toFixed(2)} €</p>
                                  <p className="text-sm font-bold">
                                    {((parseFloat(item.price) || 0) * item.quantity).toFixed(2)} €
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="shipping">
                        <AccordionTrigger className="py-2">
                          <span className="flex items-center">
                            <Home className="mr-2 h-4 w-4" /> 
                            Adresse de livraison
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p>{order.shippingAddress?.street || "Adresse non spécifiée"}</p>
                          <p>{order.shippingAddress?.city} {order.shippingAddress?.zipCode}</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Prix total</p>
                      <p className="text-2xl font-bold">
                        {order.totalPrice ? `${order.totalPrice.toFixed(2)} €` : "N/A"}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Button variant="outline" className="mr-2" onClick={() => window.location.href = `/products/${order.id}`}>
                        Détails
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      {(order.status === "pending" || order.status === "processing") && (
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            // Ici on pourrait implémenter la logique d'annulation
                            toast({
                              title: "Annulation de commande",
                              description: "Fonctionnalité d'annulation à implémenter",
                            });
                          }}
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
