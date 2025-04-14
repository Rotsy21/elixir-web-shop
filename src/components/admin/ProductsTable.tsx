
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/models/types";
import { Download, Edit, PlusCircle, Search, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductsTable({ products, isLoading }: ProductsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestion des produits</CardTitle>
          <CardDescription>
            Gérez votre catalogue de produits
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un produit..." className="pl-8" />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
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
                  <TableCell colSpan={6} className="text-center py-8">
                    Chargement des données...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Aucun produit trouvé
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
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
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
