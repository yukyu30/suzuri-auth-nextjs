import useImage from 'use-image';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  title: string;
  pngSampleImageUrl: string;
  price: number;
};

type ProductListProps = {
  onSelectProduct: (image: HTMLImageElement) => void;
};

export const ProductList = ({ onSelectProduct }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/suzuri/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  return (
    <div className="flex gap-2 p-4 bg-white rounded-lg shadow overflow-x-auto max-w-full">
      <div className="flex gap-2">
        {products.map((product) => (
          <ProductButton
            key={product.id}
            src={product.pngSampleImageUrl}
            title={product.title}
            onSelect={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};

type ProductButtonProps = {
  src: string;
  title: string;
  onSelect: (image: HTMLImageElement) => void;
};

const ProductButton = ({ src, title, onSelect }: ProductButtonProps) => {
  const [image] = useImage(src);

  return (
    <button
      onClick={() => image && onSelect(image)}
      className="w-24 h-24 flex flex-col items-center justify-center border border-gray-200 rounded hover:bg-gray-50 flex-shrink-0 p-2"
    >
      {image && (
        <>
          <img src={src} alt={title} className="w-16 h-16 object-contain" />
          <div className="text-xs text-gray-600 truncate w-full text-center mt-1">
            {title}
          </div>
        </>
      )}
    </button>
  );
};
