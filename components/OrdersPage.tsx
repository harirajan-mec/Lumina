import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../App';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const { user } = useContext(ShopContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        const data = await orderService.getUserOrders(user.id);
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="p-20 text-center">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No past orders</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">You haven't placed any orders yet.</p>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition inline-block shadow-lg shadow-indigo-200 dark:shadow-none">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Orders</h1>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
          {orders.length} orders
        </span>
      </div>

      <div className="space-y-6 animate-fade-in">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-8 text-sm">
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">Order Placed</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.date}</span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">Total</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{order.total.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">Ship To</span>
                  <span className="font-medium text-gray-900 dark:text-white">Current User</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">Order # {order.id}</span>
                <Link to="#" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">View Invoice</Link>
              </div>
            </div>

            {/* Order Body */}
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${order.status === 'Delivered' ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}>
                {order.status}
              </h3>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">
                        <Link to={`/product/${item.product.id}`} className="hover:underline">{item.product.name}</Link>
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Size: {item.size} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ₹{item.product.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Footer */}
            <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Payment Method: <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};