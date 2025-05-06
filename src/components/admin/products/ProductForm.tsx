
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, Upload } from "lucide-react";
import { useState } from "react";
import { Product } from "@/models/types";

interface ProductFormProps {
  product: Partial<Product>;
  onChange: (updatedProduct: Partial<Product>) => void;
  isMobile: boolean;
}

export function ProductForm({ product, onChange, isMobile }: ProductFormProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(product.image || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse number fields
    if (name === 'price' || name === 'stock') {
      parsedValue = parseFloat(value) || 0;
    }
    
    onChange({ ...product, [name]: parsedValue });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setSelectedImage(imageUrl);
        onChange({ ...product, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 py-2`}>
      {/* Image preview - made more compact */}
      <div className={`${isMobile ? '' : 'col-span-2'} flex flex-row items-center gap-3 mb-1`}>
        <div className="w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
          {selectedImage || product.image ? (
            <img 
              src={selectedImage || product.image} 
              alt="Prévisualisation" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <Image className="h-4 w-4" />
            </div>
          )}
        </div>
        
        <div>
          <label className="cursor-pointer bg-primary text-white px-2 py-1 rounded-md text-xs flex items-center">
            <Upload className="h-3 w-3 mr-1" />
            Image
            <input 
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
      
      {/* Form fields - more compact */}
      <div>
        <label htmlFor="name" className="text-xs font-medium block mb-1">Nom</label>
        <Input 
          id="name"
          name="name"
          value={product.name || ''}
          onChange={handleInputChange}
          placeholder="Nom du produit"
          className="h-8 text-sm"
        />
      </div>

      <div>
        <label htmlFor="price" className="text-xs font-medium block mb-1">Prix (€)</label>
        <Input 
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={product.price || 0}
          onChange={handleInputChange}
          placeholder="0.00"
          className="h-8 text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="text-xs font-medium block mb-1">Catégorie</label>
        <Input 
          id="category"
          name="category"
          value={product.category || ''}
          onChange={handleInputChange}
          placeholder="Catégorie"
          className="h-8 text-sm"
        />
      </div>

      <div>
        <label htmlFor="stock" className="text-xs font-medium block mb-1">Stock</label>
        <Input 
          id="stock"
          name="stock"
          type="number"
          value={product.stock || 0}
          onChange={handleInputChange}
          placeholder="0"
          className="h-8 text-sm"
        />
      </div>

      <div className={`${isMobile ? '' : 'col-span-2'}`}>
        <label htmlFor="description" className="text-xs font-medium block mb-1">Description</label>
        <Textarea
          id="description"
          name="description"
          className="min-h-[60px] text-sm"
          value={product.description || ''}
          onChange={handleInputChange}
          placeholder="Description..."
          rows={2}
        />
      </div>
    </div>
  );
}
