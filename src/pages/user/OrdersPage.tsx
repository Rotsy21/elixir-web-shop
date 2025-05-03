
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order, OrderStatus } from "@/models/types";

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const { orders, cancelOrder } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtrer les commandes pour l'utilisateur actuel
  const userOrders = orders.filter(
    (order) => order.userId === currentUser?.id
  );

  // Tri des commandes par date (la plus récente en premier)
  const sortedOrders = [...userOrders].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  // Grouper les commandes par statut
  const pendingOrders = sortedOrders.filter(
    (order) => order.status === "pending"
  );
  const processingOrders = sortedOrders.filter(
    (order) => order.status === "processing"
  );
  const shippedOrders = sortedOrders.filter(
    (order) => order.status === "shipped"
  );
  const deliveredOrders = sortedOrders.filter(
    (order) => order.status === "delivered"
  );
  const cancelledOrders = sortedOrders.filter(
    (order) => order.status === "cancelled"
  );

  // Formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Formater un prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Gérer l'annulation d'une commande
  const handleCancelOrder = (orderId: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir annuler cette commande?")
    ) {
      cancelOrder(orderId);
    }
  };

  // Badge de statut avec couleur appropriée
  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const statusMap: Record<
      OrderStatus,
      { label: string; variant: "default" | "destructive" | "outline" | "secondary" }
    > = {
      pending: {
        label: "En attente",
        variant: "outline",
      },
      processing: {
        label: "En traitement",
        variant: "secondary",
      },
      shipped: {
        label: "Expédiée",
        variant: "default",
      },
      delivered: {
        label: "Livrée",
        variant: "default",
      },
      cancelled: {
        label: "Annulée",
        variant: "destructive",
      },
    };

    return (
      <Badge variant={statusMap[status].variant}>
        {statusMap[status].label}
      </Badge>
    );
  };

  // Tableau des commandes
  const OrdersTable = ({ orders }: { orders: Order[] }) => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucune commande dans cette catégorie.
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Commande</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.orderNumber}</TableCell>
              <TableCell>{formatDate(order.orderDate)}</TableCell>
              <TableCell>{formatPrice(order.total)}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Détails
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>
                        Commande #{order.orderNumber}
                      </DialogTitle>
                      <DialogDescription>
                        Effectuée le {formatDate(order.orderDate)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Statut</p>
                          <StatusBadge status={order.status} />
                        </div>
                        <div>
                          <p className="font-semibold">Total</p>
                          <p>{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          Articles commandés
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produit</TableHead>
                              <TableHead>Prix</TableHead>
                              <TableHead>Quantité</TableHead>
                              <TableHead className="text-right">
                                Sous-total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                  {formatPrice(item.price)}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="text-right">
                                  {formatPrice(item.price * item.quantity)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Adresse de livraison
                          </h4>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.zipCode}{" "}
                            {order.shippingAddress.city}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Méthode de paiement
                          </h4>
                          <p>{order.paymentMethod}</p>
                        </div>
                      </div>

                      {order.status === "pending" && (
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Annuler la commande
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                {order.status === "pending" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Annuler
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // Page de commandes
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mes commandes</CardTitle>
        </CardHeader>
        <CardContent>
          {userOrders.length === 0 ? (
            <Alert>
              <AlertTitle>Aucune commande</AlertTitle>
              <AlertDescription>
                Vous n'avez pas encore passé de commande.
                <div className="mt-4">
                  <Button onClick={() => window.location.href = "/products"}>
                    Explorer nos produits
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  Toutes ({sortedOrders.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  En attente ({pendingOrders.length})
                </TabsTrigger>
                <TabsTrigger value="processing">
                  En traitement ({processingOrders.length})
                </TabsTrigger>
                <TabsTrigger value="shipped">
                  Expédiées ({shippedOrders.length})
                </TabsTrigger>
                <TabsTrigger value="delivered">
                  Livrées ({deliveredOrders.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Annulées ({cancelledOrders.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <OrdersTable orders={sortedOrders} />
              </TabsContent>
              <TabsContent value="pending">
                <OrdersTable orders={pendingOrders} />
              </TabsContent>
              <TabsContent value="processing">
                <OrdersTable orders={processingOrders} />
              </TabsContent>
              <TabsContent value="shipped">
                <OrdersTable orders={shippedOrders} />
              </TabsContent>
              <TabsContent value="delivered">
                <OrdersTable orders={deliveredOrders} />
              </TabsContent>
              <TabsContent value="cancelled">
                <OrdersTable orders={cancelledOrders} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
