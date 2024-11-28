import useImage from 'use-image';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  title: string;
  pngSampleImageUrl: string;
  price: number;
  item: {
    id: number;
  };
};

const SALE_ITEM_IDS = [1, 15, 106, 9, 96, 28, 5, 95, 146, 3, 13, 151, 109];

type ProductListProps = {
  onSelectProduct: (image: HTMLImageElement, name: string) => void;
  onClose: () => void;
};

export const ProductList = ({ onSelectProduct, onClose }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaleItemsOnly, setShowSaleItemsOnly] = useState(true);
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
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showSaleItemsOnly) {
      filtered = filtered.filter((product) =>
        SALE_ITEM_IDS.includes(product.item.id)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, products, showSaleItemsOnly]);

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
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">グッズを追加</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="閉じる"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div className="sticky top-0 z-10 p-4 bg-white border-b shadow-sm">
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="グッズ名で検索..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="saleItemsFilter"
              checked={showSaleItemsOnly}
              onChange={(e) => setShowSaleItemsOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor="saleItemsFilter"
              className="text-sm text-gray-700 select-none"
            >
              ブラックフライデーセール対象グッズのみ表示
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredProducts.length > 0 ? (
          <div className="p-4 grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductButton
                key={product.id}
                src={product.pngSampleImageUrl}
                title={product.title}
                onSelect={onSelectProduct}
                isSaleItem={SALE_ITEM_IDS.includes(product.item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
            {loading ? (
              <div className="space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
                <p>読み込み中...</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg mb-2">
                  {searchTerm || showSaleItemsOnly
                    ? '条件に一致するグッズが見つかりません'
                    : 'グッズがありません'}
                </p>
                <p className="text-sm">
                  {searchTerm && '検索条件を変更してお試しください'}
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && hasMore && filteredProducts.length > 0 && (
          <div className="p-4 text-center">
            <button
              onClick={handleLoadMore}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              さらに読み込む
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

type ProductButtonProps = {
  src: string;
  title: string;
  onSelect: (image: HTMLImageElement, name: string) => void;
  isSaleItem: boolean;
};

const ProductButton = ({
  src,
  title,
  onSelect,
  isSaleItem,
}: ProductButtonProps) => {
  const proxiedSrc = `/api/proxy/image?url=${encodeURIComponent(src)}`;
  const [image] = useImage(proxiedSrc);

  return (
    <button
      onClick={() => image && onSelect(image, title)}
      className={`group relative flex flex-col bg-white border rounded-lg overflow-hidden transition-all hover:shadow-md ${
        isSaleItem ? 'border-red-200' : 'border-gray-200'
      }`}
    >
      {isSaleItem && (
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-br">
            SALE
          </div>
        </div>
      )}

      <div className="aspect-square p-3 flex items-center justify-center bg-white">
        {image && (
          <img
            src={proxiedSrc}
            alt={title}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
          />
        )}
      </div>
      <div className="p-2 bg-gray-50 border-t">
        <p className="text-xs text-gray-700 line-clamp-2 text-left">{title}</p>
      </div>
    </button>
  );
};
