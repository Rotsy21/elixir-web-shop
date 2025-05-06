
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
import { useState, useEffect } from "react";
import { Product } from "@/models/types";
import { ProductForm } from "./ProductForm";
import { mongodbHelpers } from "@/data/mongodb";
import { toast } from "@/hooks/use-toast";

interface EditProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => void;
  isMobile: boolean;
}

export function EditProductDialog({ 
  isOpen, 
  onOpenChange, 
  product, 
  onSave,
  isMobile 
}: EditProductDialogProps) {
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
    }
  }, [product]);

  const handleSave = async () => {
    try {
      if (currentProduct.id) {
        // Appel à MongoDB
        const updatedProduct = await mongodbHelpers.updateProduct(currentProduct.id, currentProduct);
        
        onSave(updatedProduct as Product);
        
        toast({
          title: "Produit modifié",
          description: "Le produit a été modifié avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le produit.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[90%]' : 'sm:max-w-md'}`}>
        <DialogHeader>
          <DialogTitle>Modifier un produit</DialogTitle>
          <DialogDescription>
            Modifiez les détails du produit
          </DialogDescription>
        </DialogHeader>
        
        {product && (
          <ProductForm 
            product={currentProduct} 
            onChange={setCurrentProduct}
            isMobile={isMobile}
          />
        )}

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
