
interface ProductsHeaderProps {
  title: string;
  description: string;
}

export default function ProductsHeader({ title, description }: ProductsHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
}
