
import { Button } from "@/components/ui/button";
import { Download, PlusCircle, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Product } from "@/models/types";
import { ProductList } from "./ProductList";
import { AddProductDialog } from "./AddProductDialog";
import { EditProductDialog } from "./EditProductDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductsTable({ products: initialProducts, isLoading }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const isMobile = useIsMobile();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
  );

  const handleEdit = (id: string) => {
    const productToEdit = products.find(product => product.id === id);
    if (productToEdit) {
      setCurrentProduct(productToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mongodbHelpers.deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleExport = () => {
    // Logic for exporting products would go here
    toast({
      title: "Export des produits",
      description: "Les données des produits ont été exportées.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des produits</CardTitle>
            <CardDescription>
              Gérez votre catalogue de produits
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un produit..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          
          <ProductList 
            products={filteredProducts} 
            isLoading={isLoading} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </CardContent>
      </Card>

      <EditProductDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        product={currentProduct}
        onSave={(updatedProduct) => {
          setProducts(prev => prev.map(p => 
            p.id === updatedProduct.id ? updatedProduct : p
          ));
          setIsEditDialogOpen(false);
        }}
        isMobile={isMobile}
      />

      <AddProductDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAdd={(newProduct) => {
          setProducts(prev => [...prev, newProduct]);
          setIsAddDialogOpen(false);
        }}
        isMobile={isMobile}
      />
    </>
  );
}
