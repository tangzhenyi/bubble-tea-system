import { Plus, ShoppingCart as CartIcon } from 'lucide-react';
import { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [showAddTo, setShowAddTo] = useState(false);

  const handleAddClick = () => {
    setShowAddTo(true);
    setTimeout(() => setShowAddTo(false), 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* 图片 */}
      <div className="relative w-full h-40 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=' + product.name;
          }}
        />
        {product.isHot && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            热销
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="p-3">
        {/* 名称 */}
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* 销量和评分 */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>销量: {product.sales}</span>
          <span>⭐ {product.rating.toFixed(1)}</span>
        </div>

        {/* 价格和按钮 */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber-700">¥{product.price.toFixed(2)}</span>
          <button
            onClick={() => {
              onAddToCart(product);
              handleAddClick();
            }}
            className={`p-2 rounded-full transition-all ${
              showAddTo
                ? 'bg-green-500 text-white scale-110'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {showAddTo ? <CartIcon size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
