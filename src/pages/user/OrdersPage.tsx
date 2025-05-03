
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { Order, OrderItem } from "@/models/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const { userOrders, isLoading } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fonction pour déterminer la couleur du badge selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
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

  // Fonction pour formater la date
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    
    const date = typeof dateString === 'string' 
      ? new Date(dateString) 
      : dateString;
    
    return format(date, "dd MMMM yyyy 'à' HH:mm", { locale: fr });
  };

  // Calculer le total d'une commande
  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mes commandes</CardTitle>
          <CardDescription>
            Historique de vos commandes et leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Chargement de vos commandes...</div>
          ) : userOrders.length === 0 ? (
            <div className="py-8 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucune commande</h3>
              <p className="text-muted-foreground mt-2">
                Vous n'avez pas encore passé de commande.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° de commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                      <TableCell>{formatDate(order.createdAt || new Date())}</TableCell>
                      <TableCell>{order.totalAmount.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="sm:max-w-md">
                            {selectedOrder && (
                              <>
                                <SheetHeader>
                                  <SheetTitle>Commande #{selectedOrder.id.substring(0, 8)}</SheetTitle>
                                  <SheetDescription>
                                    Détails de votre commande
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="space-y-6 mt-6">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-900">Informations</h3>
                                    <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                                      <div className="flex justify-between py-2 text-sm">
                                        <dt className="text-gray-500">Date</dt>
                                        <dd className="font-medium">{formatDate(selectedOrder.createdAt || new Date())}</dd>
                                      </div>
                                      <div className="flex justify-between py-2 text-sm">
                                        <dt className="text-gray-500">Statut</dt>
                                        <dd>
                                          <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                                            {selectedOrder.status}
                                          </Badge>
                                        </dd>
                                      </div>
                                      <div className="flex justify-between py-2 text-sm">
                                        <dt className="text-gray-500">Mode de paiement</dt>
                                        <dd className="font-medium">{selectedOrder.paymentMethod}</dd>
                                      </div>
                                    </dl>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-900">Adresse de livraison</h3>
                                    <address className="mt-2 not-italic text-sm text-gray-600 border-b border-gray-200 pb-4">
                                      {selectedOrder.shippingAddress.street}<br />
                                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                                      {selectedOrder.shippingAddress.country}
                                    </address>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-900">Produits achetés</h3>
                                    <ul className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                                      {selectedOrder.items.map((item) => (
                                        <li key={item.productId} className="flex justify-between py-2">
                                          <div className="text-sm">
                                            <div className="font-medium">{item.productName}</div>
                                            <div className="text-gray-500">Qté: {item.quantity}</div>
                                          </div>
                                          <div className="text-sm">
                                            <div className="font-medium">{(item.unitPrice * item.quantity).toFixed(2)} €</div>
                                            <div className="text-gray-500">{item.unitPrice.toFixed(2)} € / unité</div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="flex justify-between pt-2">
                                    <div className="text-base font-medium">Total</div>
                                    <div className="text-base font-medium">
                                      {calculateTotal(selectedOrder.items)} €
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
