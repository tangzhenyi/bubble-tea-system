import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';

const API_BASE = 'http://localhost:3001/api';

export default function Category() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    searchParams.get('categoryId')
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedCategoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE}/products/categories`),
        selectedCategoryId
          ? axios.get(`${API_BASE}/products?categoryId=${selectedCategoryId}`)
          : axios.get(`${API_BASE}/products`),
      ]);

      setCategories(categoriesRes.data.data || []);
      let productList = productsRes.data.data || [];

      // 搜索过滤
      if (searchQuery) {
        productList = productList.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setProducts(productList);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleAddToCart = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索 */}
      <div className="sticky top-0 z-30 bg-white shadow-sm p-4">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="搜索商品"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* 左侧分类列表 */}
        <div className="w-24 bg-white border-r border-gray-200 overflow-y-auto">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`w-full p-3 text-center text-sm font-medium border-l-4 transition-all ${
              !selectedCategoryId
                ? 'border-amber-700 bg-amber-50 text-amber-700'
                : 'border-transparent text-gray-700 hover:bg-gray-50'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategorySelect(category._id)}
              className={`w-full p-3 text-center text-sm font-medium border-l-4 transition-all ${
                selectedCategoryId === category._id
                  ? 'border-amber-700 bg-amber-50 text-amber-700'
                  : 'border-transparent text-gray-700 hover:bg-gray-50'
              }`}
              title={category.name}
            >
              <div className="text-lg mb-1">{category.icon}</div>
              <div className="text-xs line-clamp-2">{category.name}</div>
            </button>
          ))}
        </div>

        {/* 右侧商品列表 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🧋</div>
                <p>加载中...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📭</div>
                <p>暂无商品</p>
              </div>
            </div>
          ) : (
            <div className="p-3 grid grid-cols-2 gap-3">
              {products.map((product) => (
                <div key={product._id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
