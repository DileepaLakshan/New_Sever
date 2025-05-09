import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // References the User model
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product', // References the Product model
        },
        quantity: { type: Number, required: true },
        name: { type: String, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, },
      district: { type: String, },
      province: { type: String, },
      zipCode: { type: String, },
    },
    paymentMethod: {
      type: String,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      default: 'Item Preparing',
      enum: ['Item Preparing', 'Item Packing', 'Out for Delivery', 'Delivered'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
