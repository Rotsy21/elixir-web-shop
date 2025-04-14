
import { useState, useEffect } from "react";
import { getProducts } from "@/data/mockData";
import { Product } from "@/models/types";
import ProductCard from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query and category
    let result = products;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "featured":
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, sortOption]);

  // Get unique categories from products
  const categories = ["all", ...new Set(products.map((product) => product.category.toLowerCase()))];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Boissons</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de boissons artisanales, préparées avec passion
            et des ingrédients de qualité supérieure.
          </p>
        </div>

        {/* Filtering and sorting */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Rechercher un produit..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all"
                          ? "Toutes les catégories"
                          : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="featured">Mis en avant</SelectItem>
                    <SelectItem value="price-low-high">Prix croissant</SelectItem>
                    <SelectItem value="price-high-low">Prix décroissant</SelectItem>
                    <SelectItem value="newest">Plus récents</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="grid" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                </TabsTrigger>
              </TabsList>
            </div>

            {isLoading ? (
              // Loading state
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-lg bg-white shadow-sm animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="grid" className="mt-0">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium text-gray-900">Aucun produit trouvé</h3>
                      <p className="mt-2 text-gray-500">Essayez de modifier vos critères de recherche</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium text-gray-900">Aucun produit trouvé</h3>
                      <p className="mt-2 text-gray-500">Essayez de modifier vos critères de recherche</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="flex bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="w-1/4 min-w-32">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{product.name}</h3>
                              <p className="text-gray-500 mt-1">{product.description}</p>
                              <p className="text-primary font-bold mt-2">{product.price.toFixed(2)} €</p>
                            </div>
                            <div className="flex justify-end items-center mt-4">
                              <button className="text-primary hover:text-primary/80 mr-4">
                                Détails
                              </button>
                              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                                Ajouter au panier
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
