// 模拟门店数据
const mockStores = [
  {
    _id: '607f1f77bcf86cd799439011',
    name: '鹿茶中关村店',
    address: '北京市海淀区中关村大街1号',
    phone: '010-12345678',
    email: 'lucha.zgc@example.com',
    businessHours: [
      {
        day: 'Monday',
        openTime: '09:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        day: 'Tuesday',
        openTime: '09:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        day: 'Wednesday',
        openTime: '09:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        day: 'Thursday',
        openTime: '09:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        day: 'Friday',
        openTime: '09:00',
        closeTime: '23:00',
        isClosed: false,
      },
      {
        day: 'Saturday',
        openTime: '10:00',
        closeTime: '23:00',
        isClosed: false,
      },
      {
        day: 'Sunday',
        openTime: '10:00',
        closeTime: '23:00',
        isClosed: false,
      },
    ],
    location: {
      type: 'Point',
      coordinates: [116.3055, 39.9747], // 中关村
      address: '北京市海淀区中关村大街1号',
    },
    isOpen: true,
    description: '中关村繁华商业区，环境优美，设施完善',
    image: 'https://via.placeholder.com/300x200?text=Zhongguancun+Store',
    rating: 4.8,
    reviewCount: 256,
    deliveryTime: 30,
    deliveryFee: 5,
    minimumOrder: 15,
    maxDeliveryDistance: 3,
    capacity: 50,
    currentOrderCount: 8,
    status: 'open',
    manager: '王经理',
    tags: ['wifi', '可外卖', '堂食', '外带', '停车方便'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: '607f1f77bcf86cd799439012',
    name: '鹿茶朝阳店',
    address: '北京市朝阳区建国路88号',
    phone: '010-87654321',
    email: 'lucha.cy@example.com',
    businessHours: [
      {
        day: 'Monday',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        day: 'Tuesday',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        day: 'Wednesday',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        day: 'Thursday',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        day: 'Friday',
        openTime: '08:00',
        closeTime: '23:00',
        isClosed: false,
      },
      {
        day: 'Saturday',
        openTime: '09:00',
        closeTime: '23:00',
        isClosed: false,
      },
      {
        day: 'Sunday',
        openTime: '09:00',
        closeTime: '23:00',
        isClosed: false,
      },
    ],
    location: {
      type: 'Point',
      coordinates: [116.4774, 39.9087], // 朝阳
      address: '北京市朝阳区建国路88号',
    },
    isOpen: true,
    description: '朝阳商务区，地理位置优越，人流量大',
    image: 'https://via.placeholder.com/300x200?text=Chaoyang+Store',
    rating: 4.7,
    reviewCount: 189,
    deliveryTime: 25,
    deliveryFee: 4,
    minimumOrder: 12,
    maxDeliveryDistance: 4,
    capacity: 80,
    currentOrderCount: 15,
    status: 'busy',
    manager: '李经理',
    tags: ['wifi', '可外卖', '堂食', '外带', '24小时'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

/**
 * 获取门店列表
 * GET /stores
 */
export const getStores = async (req, res) => {
  try {
    const { isOpen, status } = req.query;

    let stores = [...mockStores];

    // 按营业状态筛选
    if (isOpen === 'true') {
      stores = stores.filter((s) => s.isOpen === true);
    } else if (isOpen === 'false') {
      stores = stores.filter((s) => s.isOpen === false);
    }

    // 按状态筛选
    if (status) {
      stores = stores.filter((s) => s.status === status);
    }

    // 按评分排序
    stores.sort((a, b) => b.rating - a.rating);

    res.status(200).json({
      success: true,
      data: stores,
      total: stores.length,
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stores',
      error: error.message,
    });
  }
};

/**
 * 获取门店详情
 * GET /stores/:id
 */
export const getStoreDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const store = mockStores.find((s) => s._id === id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    console.error('Get store detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get store detail',
      error: error.message,
    });
  }
};

/**
 * 按地理位置搜索门店 (模拟)
 * GET /stores/nearby?lng=116.3&lat=39.9&distance=5
 */
export const getNearbyStores = async (req, res) => {
  try {
    const { lng, lat, distance = 5 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: lng, lat',
      });
    }

    // 模拟: 简单的距离计算 (实际应该使用 MongoDB 的地理查询)
    const userLng = parseFloat(lng);
    const userLat = parseFloat(lat);
    const maxDistance = parseFloat(distance);

    const nearbyStores = mockStores.filter((store) => {
      const storeLng = store.location.coordinates[0];
      const storeLat = store.location.coordinates[1];

      // 简单欧几里得距离（模拟）
      const distanceToStore = Math.sqrt(
        Math.pow(userLng - storeLng, 2) + Math.pow(userLat - storeLat, 2)
      );

      return distanceToStore <= maxDistance * 0.01; // 粗略估计
    });

    res.status(200).json({
      success: true,
      data: nearbyStores,
      total: nearbyStores.length,
    });
  } catch (error) {
    console.error('Get nearby stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nearby stores',
      error: error.message,
    });
  }
};

/**
 * 获取门店营业信息
 * GET /stores/:id/status
 */
export const getStoreStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const store = mockStores.find((s) => s._id === id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayMap[dayOfWeek];

    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const todayHours = store.businessHours.find((h) => h.day === currentDay);

    const isCurrentlyOpen =
      store.isOpen &&
      todayHours &&
      !todayHours.isClosed &&
      currentTime >= todayHours.openTime &&
      currentTime <= todayHours.closeTime;

    res.status(200).json({
      success: true,
      data: {
        storeId: store._id,
        storeName: store.name,
        isOpen: store.isOpen,
        status: store.status,
        isCurrentlyOpen,
        currentOrders: store.currentOrderCount,
        capacity: store.capacity,
        deliveryTime: store.deliveryTime,
        deliveryFee: store.deliveryFee,
        minimumOrder: store.minimumOrder,
        todayHours,
        currentTime,
      },
    });
  } catch (error) {
    console.error('Get store status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get store status',
      error: error.message,
    });
  }
};

/**
 * 获取热门门店
 * GET /stores/hot
 */
export const getHotStores = async (req, res) => {
  try {
    const hotStores = mockStores.filter((s) => s.rating >= 4.7).sort((a, b) => b.rating - a.rating);

    res.status(200).json({
      success: true,
      data: hotStores,
      total: hotStores.length,
    });
  } catch (error) {
    console.error('Get hot stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get hot stores',
      error: error.message,
    });
  }
};
