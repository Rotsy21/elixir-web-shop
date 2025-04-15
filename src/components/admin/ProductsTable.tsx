
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
import { Download, Edit, PlusCircle, Search, Trash2, Save } from "lucide-react";
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

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
}

interface ProductFormData {
  id?: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

export function ProductsTable({ products: initialProducts, isLoading }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductFormData>({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    description: ''
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

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès.",
    });
  };

  const handleEdit = (id: number) => {
    const productToEdit = products.find(product => product.id === id);
    if (productToEdit) {
      setCurrentProduct({
        id: productToEdit.id,
        name: productToEdit.name,
        price: productToEdit.price,
        category: productToEdit.category,
        stock: productToEdit.stock,
        description: productToEdit.description || ''
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentProduct({
      name: '',
      price: 0,
      category: '',
      stock: 0,
      description: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setProducts(prev => prev.map(product => 
      product.id === currentProduct.id 
        ? { 
            ...product, 
            name: currentProduct.name,
            price: currentProduct.price,
            category: currentProduct.category,
            stock: currentProduct.stock,
            description: currentProduct.description
          } 
        : product
    ));
    
    setIsEditDialogOpen(false);
    toast({
      title: "Produit modifié",
      description: "Le produit a été modifié avec succès.",
    });
  };

  const handleSaveAdd = () => {
    // Generate a new ID (in a real app, this would come from the backend)
    const newId = Math.max(0, ...products.map(p => p.id)) + 1;
    
    const newProduct: Product = {
      id: newId,
      name: currentProduct.name,
      price: currentProduct.price,
      category: currentProduct.category,
      stock: currentProduct.stock,
      description: currentProduct.description,
      image: '/placeholder.svg',
      createdAt: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    setIsAddDialogOpen(false);
    toast({
      title: "Produit ajouté",
      description: "Le nouveau produit a été ajouté avec succès.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export des produits",
      description: "Les données des produits ont été exportées.",
    });
    // Ici on pourrait implémenter la logique d'export
  };

  const renderProductForm = () => (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Nom du produit</label>
        <Input 
          id="name"
          name="name"
          value={currentProduct.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium">Prix (€)</label>
        <Input 
          id="price"
          name="price"
          type="number"
          value={currentProduct.price}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">Catégorie</label>
        <Input 
          id="category"
          name="category"
          value={currentProduct.category}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="stock" className="text-sm font-medium">Stock</label>
        <Input 
          id="stock"
          name="stock"
          type="number"
          value={currentProduct.stock}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          className="w-full min-h-[100px] p-2 border rounded-md"
          value={currentProduct.description}
          onChange={handleInputChange}
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
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier un produit</DialogTitle>
            <DialogDescription>
              Modifiez les détails du produit
            </DialogDescription>
          </DialogHeader>
          
          {renderProductForm()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
            <DialogDescription>
              Créez un nouveau produit dans votre catalogue
            </DialogDescription>
          </DialogHeader>
          
          {renderProductForm()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveAdd} disabled={!currentProduct.name}>
              <Save className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
