
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";
import { Product } from "@/models/types";
import { ProductForm } from "./ProductForm";
import { mongodbHelpers } from "@/data/mongodb";
import { toast } from "@/hooks/use-toast";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product) => void;
  isMobile: boolean;
}

export function AddProductDialog({ 
  isOpen, 
  onOpenChange, 
  onAdd,
  isMobile 
}: AddProductDialogProps) {
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    description: '',
    image: '/placeholder.svg'
  });

  const handleAdd = async () => {
    try {
      // Création du nouveau produit sans ID
      const newProductData = {
        name: currentProduct.name || '',
        price: currentProduct.price || 0,
        category: currentProduct.category || '',
        stock: currentProduct.stock || 0,
        description: currentProduct.description || '',
        image: currentProduct.image || '/placeholder.svg',
        featured: false
      };
      
      // Appel à MongoDB
      const newProduct = await mongodbHelpers.addProduct(newProductData);
      
      onAdd(newProduct);
      
      // Reset form
      setCurrentProduct({
        name: '',
        price: 0,
        category: '',
        stock: 0,
        description: '',
        image: '/placeholder.svg'
      });
      
      toast({
        title: "Produit ajouté",
        description: "Le nouveau produit a été ajouté avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[90%]' : 'sm:max-w-md'}`}>
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Créez un nouveau produit
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm 
          product={currentProduct} 
          onChange={setCurrentProduct}
          isMobile={isMobile}
        />

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            size="sm" 
            onClick={handleAdd} 
            disabled={!currentProduct.name}
          >
            <Save className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
