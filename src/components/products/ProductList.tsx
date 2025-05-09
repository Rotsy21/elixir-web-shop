
import { Product } from "@/models/types";
import { Link } from "react-router-dom";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900">Aucun produit trouvé</h3>
        <p className="mt-2 text-gray-500">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
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
              <Link to={`/products/${product.id}`} className="text-primary hover:text-primary/80 mr-4">
                Détails
              </Link>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
