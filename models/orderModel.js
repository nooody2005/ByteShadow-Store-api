const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user']
    },

    painting: {
      type: mongoose.Schema.ObjectId,
      ref: 'Painting',
      required: [true, 'Order must belong to a painting']
    },

    amount: {
      type: Number,
      required: [true, 'Order must have an amount']
    },

    paymobOrderId: {
      type: Number,
      default: null
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending'
    },

    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed'],
      default: 'unpaid'
    },
    shippingStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered'],
      default: 'processing'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

