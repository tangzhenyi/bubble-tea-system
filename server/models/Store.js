import mongoose from 'mongoose';

const businessHoursSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    openTime: {
      type: String,
      required: true,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:mm)'],
    },
    closeTime: {
      type: String,
      required: true,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:mm)'],
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Store name is required'],
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Store address is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Store phone is required'],
      match: [/^[\d\-\+\s()]+$/, 'Please provide a valid phone number'],
    },
    email: {
      type: String,
      default: '',
      match: [/^[\w\.-]+@[\w\.-]+\.\w+$/, 'Please provide a valid email'],
    },
    businessHours: [businessHoursSchema],
    location: {
      type: locationSchema,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: Number,
      default: 30,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDeliveryDistance: {
      type: Number,
      default: 5,
      min: 0,
    },
    capacity: {
      type: Number,
      default: 50,
      min: 0,
    },
    currentOrderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'busy', 'closed'],
        message: 'Status must be one of: open, busy, closed',
      },
      default: 'open',
    },
    manager: {
      type: String,
      default: '',
    },
    tags: [String],
  },
  {
    timestamps: true,
    collection: 'stores',
  }
);

// 创建地理位置索引
storeSchema.index({ 'location.coordinates': '2dsphere' });

// 其他索引
storeSchema.index({ name: 1 });
storeSchema.index({ isOpen: 1 });
storeSchema.index({ status: 1 });
storeSchema.index({ rating: -1 });
storeSchema.index({ createdAt: -1 });

// 虚拟字段 - 格式化营业时间
storeSchema.virtual('isCurrentlyOpen').get(function () {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayMap[dayOfWeek];

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const todayHours = this.businessHours.find((h) => h.day === currentDay);
  if (!todayHours || todayHours.isClosed) {
    return false;
  }

  return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
});

// 虚拟字段 - 状态中文
storeSchema.virtual('statusCN').get(function () {
  const statusMap = {
    open: '营业中',
    busy: '忙碌中',
    closed: '已关闭',
  };
  return statusMap[this.status] || '未知状态';
});

export default mongoose.model('Store', storeSchema);
