
import { useState } from "react";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  ShoppingBag,
  Clock,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Order } from "@/models/types";

export default function OrdersPage() {
  const { userOrders, isLoading } = useOrder();
  const { user } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes commandes</CardTitle>
            <CardDescription>Chargement de vos commandes en cours...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes commandes</CardTitle>
            <CardDescription>Veuillez vous connecter pour voir vos commandes.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes commandes</CardTitle>
            <CardDescription>Vous n'avez pas encore passé de commande.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Pas de commande</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Vous n'avez pas encore passé de commande. Parcourez notre catalogue de produits pour trouver des articles qui vous plaisent.
              </p>
              <Button className="mt-4" asChild>
                <a href="/products">Voir les produits</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
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

  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "PPP", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-6 w-6" />
            Mes commandes
          </CardTitle>
          <CardDescription>
            Historique de toutes vos commandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {userOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {order.status === "shipped" ? (
                          <Truck className="h-5 w-5 text-purple-500" />
                        ) : order.status === "delivered" ? (
                          <Package className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Commande #{order.id.substring(0, 8)}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                      <div className="text-right">
                        <div className="font-medium">
                          {order.totalAmount.toFixed(2)} €
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} article
                          {order.items.length > 1 ? "s" : ""}
                        </div>
                      </div>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-4 pb-4">
                    <div className="pt-2 pb-4">
                      <h4 className="text-sm font-medium mb-2">
                        Détails de la commande
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produit</TableHead>
                            <TableHead className="text-right">Prix unitaire</TableHead>
                            <TableHead className="text-right">Quantité</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell className="text-right">
                                {item.unitPrice.toFixed(2)} €
                              </TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {(item.unitPrice * item.quantity).toFixed(2)} €
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          Adresse de livraison:
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.fullName}<br />
                          {order.shippingAddress.addressLine1}<br />
                          {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                          {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                          {order.shippingAddress.state}, {order.shippingAddress.country}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => showOrderDetails(order)}
                      >
                        Voir les détails complets
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Détails de la commande #{selectedOrder.id.substring(0, 8)}
              </DialogTitle>
              <DialogDescription>
                Commande passée le {formatDate(selectedOrder.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Statut actuel:</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                    selectedOrder.status
                  )}`}
                >
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              <div>
                <h3 className="font-medium mb-2">Articles commandés:</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Prix unitaire</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">
                          {item.unitPrice.toFixed(2)} €
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.unitPrice * item.quantity).toFixed(2)} €
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total de la commande:
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {selectedOrder.totalAmount.toFixed(2)} €
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Informations de livraison:</h3>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                    <p>
                      {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                    </p>
                    <p>
                      {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Méthode de paiement:</h3>
                  <p className="text-sm">{selectedOrder.paymentMethod}</p>
                  {selectedOrder.trackingNumber && (
                    <>
                      <h3 className="font-medium mb-2 mt-4">Numéro de suivi:</h3>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                        {selectedOrder.trackingNumber}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-medium mb-2">Notes:</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
