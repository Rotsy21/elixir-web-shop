
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Order } from "@/models/types";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

const getStatusBadgeVariant = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "paid":
      return "default";
    case "shipped":
      return "outline";
    case "delivered":
      return "outline"; // "success" n'est pas un variant supporté donc on reste sur outline
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusLabel = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "paid":
      return "Payé";
    case "shipped":
      return "Expédié";
    case "delivered":
      return "Livré";
    case "cancelled":
      return "Annulé";
    default:
      return status;
  }
};

export function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead>Adresse de livraison</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucune commande trouvée
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">{order.id.substring(0, 8)}</TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: fr })}
                </TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.totalAmount.toFixed(2)} €</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.quantity}x {item.productName}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <div>
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && (
                      <><br />{order.shippingAddress.addressLine2}</>
                    )}
                    <br />
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    <br />
                    {order.shippingAddress.state}, {order.shippingAddress.country}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

