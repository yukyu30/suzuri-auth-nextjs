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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const LIMIT = 30;

  const fetchProducts = async (currentOffset: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/suzuri/products?limit=${LIMIT}&offset=${currentOffset}`
      );
      const data = await response.json();

      const newProducts = data.products || [];
      if (currentOffset === 0) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length === LIMIT);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    fetchProducts(0);
  }, []);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchProducts(newOffset);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      {/* 検索フィールド */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="商品名で検索..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* 商品リスト - 縦スクロール */}
      <div className="overflow-y-auto max-h-[300px]">
        <div className="grid grid-cols-4 gap-2 min-[1400px]:grid-cols-6">
          {filteredProducts.map((product) => (
            <ProductButton
              key={product.id}
              src={product.pngSampleImageUrl}
              title={product.title}
              onSelect={onSelectProduct}
            />
          ))}
        </div>

        {/* ローディングとさらに読み込むボタン */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {!loading && hasMore && filteredProducts.length === products.length && (
          <div className="text-center py-4">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              さらに読み込む
            </button>
          </div>
        )}

        {/* 検索結果がない場合のメッセージ */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            {searchTerm ? '検索結果が見つかりません' : '商品がありません'}
          </div>
        )}
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
      className="flex flex-col items-center justify-center border border-gray-200 rounded hover:bg-gray-50 p-2 aspect-square"
    >
      {image && (
        <>
          <div className="flex items-center justify-center flex-1 w-full">
            <img
              src={src}
              alt={title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="text-xs text-gray-600 truncate w-full text-center mt-1">
            {title}
          </div>
        </>
      )}
    </button>
  );
};
