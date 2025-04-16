
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/models/types";
import { Download, Edit, PlusCircle, Search, Trash2, Save, Image, Upload } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { mongodbHelpers } from "@/data/mongodb";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
}

interface ProductFormData {
  id?: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  image: string;
}

export function ProductsTable({ products: initialProducts, isLoading }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [currentProduct, setCurrentProduct] = useState<ProductFormData>({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    description: '',
    image: '/placeholder.svg'
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse number fields
    if (name === 'price' || name === 'stock') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setCurrentProduct(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setSelectedImage(imageUrl);
        setCurrentProduct(prev => ({ ...prev, image: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Appel à MongoDB
      await mongodbHelpers.deleteProduct(id);
      
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find(product => product.id === id);
    if (productToEdit) {
      setCurrentProduct({
        id: productToEdit.id,
        name: productToEdit.name,
        price: productToEdit.price,
        category: productToEdit.category,
        stock: productToEdit.stock,
        description: productToEdit.description || '',
        image: productToEdit.image || '/placeholder.svg'
      });
      setSelectedImage(productToEdit.image);
      setIsEditDialogOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentProduct({
      name: '',
      price: 0,
      category: '',
      stock: 0,
      description: '',
      image: '/placeholder.svg'
    });
    setSelectedImage(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (currentProduct.id) {
        // Appel à MongoDB
        await mongodbHelpers.updateProduct(currentProduct.id, currentProduct);
        
        setProducts(prev => prev.map(product => 
          product.id === currentProduct.id 
            ? { 
                ...product, 
                name: currentProduct.name,
                price: currentProduct.price,
                category: currentProduct.category,
                stock: currentProduct.stock,
                description: currentProduct.description,
                image: currentProduct.image
              } 
            : product
        ));
        
        setIsEditDialogOpen(false);
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

  const handleSaveAdd = async () => {
    try {
      // Création du nouveau produit
      const newProduct: Product = {
        id: Math.random().toString(36).substring(2, 9), // Génération d'ID temporaire
        name: currentProduct.name,
        price: currentProduct.price,
        category: currentProduct.category,
        stock: currentProduct.stock,
        description: currentProduct.description,
        image: currentProduct.image || '/placeholder.svg',
        featured: false,
        createdAt: new Date().toISOString()
      };
      
      // Appel à MongoDB
      const result = await mongodbHelpers.addProduct(newProduct);
      if (result.success) {
        // Mettre à jour avec l'ID généré par MongoDB
        newProduct.id = result.id;
        setProducts(prev => [...prev, newProduct]);
        setIsAddDialogOpen(false);
        toast({
          title: "Produit ajouté",
          description: "Le nouveau produit a été ajouté avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export des produits",
      description: "Les données des produits ont été exportées.",
    });
    // Ici on pourrait implémenter la logique d'export
  };

  const renderCompactProductForm = () => (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 py-2`}>
      {/* Image preview - made more compact */}
      <div className={`${isMobile ? '' : 'col-span-2'} flex flex-row items-center gap-3 mb-1`}>
        <div className="w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
          {selectedImage || currentProduct.image ? (
            <img 
              src={selectedImage || currentProduct.image} 
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
          value={currentProduct.name}
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
          value={currentProduct.price}
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
          value={currentProduct.category}
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
          value={currentProduct.stock}
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
          value={currentProduct.description}
          onChange={handleInputChange}
          placeholder="Description..."
          rows={2}
        />
      </div>
    </div>
  );

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
            <Button size="sm" onClick={handleAdd}>
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
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
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
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(product.id)}
                          >
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

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={`${isMobile ? 'max-w-[90%]' : 'sm:max-w-md'}`}>
          <DialogHeader>
            <DialogTitle>Modifier un produit</DialogTitle>
            <DialogDescription>
              Modifiez les détails du produit
            </DialogDescription>
          </DialogHeader>
          
          {renderCompactProductForm()}

          <DialogFooter className="mt-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-1" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={`${isMobile ? 'max-w-[90%]' : 'sm:max-w-md'}`}>
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
            <DialogDescription>
              Créez un nouveau produit
            </DialogDescription>
          </DialogHeader>
          
          {renderCompactProductForm()}

          <DialogFooter className="mt-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleSaveAdd} disabled={!currentProduct.name}>
              <Save className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
