
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/models/types";

interface ProductItemRowProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductItemRow({ product, onEdit, onDelete }: ProductItemRowProps) {
  return (
    <TableRow key={product.id}>
      <TableCell>{product.id}</TableCell>
      <TableCell>
        <div className="w-10 h-10 rounded-md overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.price.toFixed(2)} €</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          product.stock > 50
            ? "bg-green-100 text-green-800"
            : product.stock > 10
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}>
          {product.stock}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(product.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
