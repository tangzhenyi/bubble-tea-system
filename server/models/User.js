import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    openid: {
      type: String,
      required: [true, 'OpenID is required'],
      unique: true,
      sparse: true,
    },
    nickname: {
      type: String,
      required: [true, 'Nickname is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
      match: [/^[\d\-\+\s()]+$/, 'Please provide a valid phone number'],
    },
    loginType: {
      type: String,
      enum: {
        values: ['wechat', 'qq'],
        message: 'loginType must be either wechat or qq',
      },
      required: [true, 'Login type is required'],
    },
    email: {
      type: String,
      default: '',
      match: [/^[\w\.-]+@[\w\.-]+\.\w+$/, 'Please provide a valid email'],
    },
    address: {
      type: String,
      default: '',
    },
    defaultAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// 索引优化查询性能
userSchema.index({ openid: 1 });
userSchema.index({ loginType: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model('User', userSchema);
