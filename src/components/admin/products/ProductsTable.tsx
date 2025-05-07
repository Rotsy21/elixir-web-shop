
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
import { useState, useMemo } from "react";
import { Product } from "@/models/types";
import { ProductList } from "./ProductList";
import { AddProductDialog } from "./AddProductDialog";
import { EditProductDialog } from "./EditProductDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm)
    );
  }, [products, searchTerm]);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  
  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find(product => product.id === id);
    if (productToEdit) {
      setCurrentProduct(productToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      
      // Reset to page 1 if current page becomes empty
      const newTotalItems = filteredProducts.length - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotalItems / itemsPerPage));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive",
      });
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }} 
              />
            </div>
          </div>
          
          <ProductList 
            products={currentItems} 
            isLoading={isLoading} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
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
          // Après avoir ajouté un produit, on va à la dernière page pour le voir
          setCurrentPage(Math.ceil((products.length + 1) / itemsPerPage));
        }}
        isMobile={isMobile}
      />
    </>
  );
}
