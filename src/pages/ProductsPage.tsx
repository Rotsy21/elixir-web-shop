
import { useState, useEffect } from "react";
import { getProducts } from "@/data/mockData";
import { Product } from "@/models/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import ProductsHeader from "@/components/products/ProductsHeader";
import ProductFilters from "@/components/products/ProductFilters";
import ProductViewToggle from "@/components/products/ProductViewToggle";
import ProductGrid from "@/components/products/ProductGrid";
import ProductList from "@/components/products/ProductList";
import ProductsLoading from "@/components/products/ProductsLoading";

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
        <ProductsHeader 
          title="Nos Boissons" 
          description="Découvrez notre sélection de boissons artisanales, préparées avec passion et des ingrédients de qualité supérieure." 
        />

        {/* Filtering and sorting */}
        <div className="mb-8">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            categories={categories}
          />

          <Tabs defaultValue="grid" className="w-full">
            <ProductViewToggle defaultValue="grid" />

            {isLoading ? (
              <ProductsLoading />
            ) : (
              <>
                <TabsContent value="grid" className="mt-0">
                  <ProductGrid products={filteredProducts} />
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  <ProductList products={filteredProducts} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
