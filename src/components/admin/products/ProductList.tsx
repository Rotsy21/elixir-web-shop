
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/models/types";
import { ProductItemRow } from "./ProductItemRow";
import { ProductPagination } from "./ProductPagination";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export function ProductList({ 
  products, 
  isLoading, 
  onEdit, 
  onDelete, 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage 
}: ProductListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Chargement des données...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <ProductItemRow 
                key={product.id} 
                product={product} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))
          )}
        </TableBody>
      </Table>
      
      {!isLoading && products.length > 0 && totalPages > 1 && (
        <div className="py-4 border-t">
          <ProductPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={onPageChange} 
          />
        </div>
      )}
    </div>
  );
}
