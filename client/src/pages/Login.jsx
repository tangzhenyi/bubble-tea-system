import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('wechat');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);

      const endpoint =
        loginType === 'wechat' ? `${API_BASE}/auth/wechat-login` : `${API_BASE}/auth/qq-login`;

      const response = await axios.post(endpoint, {
        code: 'test_code_' + Date.now(),
      });

      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setNotification('✓ 登录成功');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setNotification('✗ 登录失败，请重试');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
      {/* 品牌 */}
      <div className="text-center mb-12">
        <div className="text-7xl mb-4">🧋</div>
        <h1 className="text-3xl font-bold text-amber-900">鹿茶</h1>
        <p className="text-gray-600 text-sm mt-2">新鲜奶茶 · 品质生活</p>
      </div>

      {/* 登录卡片 */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">登录账户</h2>
        <p className="text-gray-600 text-sm mb-8">选择你的登录方式</p>

        {/* 登录方式选择 */}
        <div className="space-y-4 mb-8">
          {/* 微信登录 */}
          <button
            onClick={() => {
              setLoginType('wechat');
              handleLogin();
            }}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              loginType === 'wechat' || loading
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:shadow-lg'
            } ${loading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="text-2xl">💬</span>
            {loading && loginType === 'wechat' ? '登录中...' : '微信登录'}
          </button>

          {/* QQ登录 */}
          <button
            onClick={() => {
              setLoginType('qq');
              handleLogin();
            }}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
              loginType === 'qq' || loading
                ? 'bg-blue-600 text-white'
                : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:shadow-lg'
            } ${loading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="text-2xl">👨</span>
            {loading && loginType === 'qq' ? '登录中...' : 'QQ登录'}
          </button>
        </div>

        {/* 提示信息 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          <p className="font-semibold mb-1">💡 提示</p>
          <p>此为演示环境，点击即可登录</p>
        </div>
      </div>

      {/* 底部链接 */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          游客浏览?{' '}
          <button
            onClick={() => navigate('/')}
            className="text-amber-700 font-semibold hover:underline"
          >
            继续浏览
          </button>
        </p>
      </div>

      {/* 通知提示 */}
      {notification && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold z-50">
          {notification}
        </div>
      )}
    </div>
  );
}
