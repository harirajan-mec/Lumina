import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await orderService.getAllOrders();
            setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="p-10 text-center">Loading orders...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Orders</h1>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex flex-col md:flex-row justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order #{order.id.slice(0, 8)}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Date: {order.date}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Status: <span className="font-medium text-indigo-600">{order.status}</span></p>
                            </div>
                            <div className="text-right mt-2 md:mt-0">
                                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{order.total.toFixed(2)}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{order.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User & Address Info */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Details</h4>
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <p><span className="font-medium">Name:</span> {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                                    <p><span className="font-medium">Email:</span> {order.shippingAddress?.email}</p>
                                    <p><span className="font-medium">Phone:</span> {order.shippingAddress?.phone}</p>
                                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="font-medium mb-1">Shipping Address:</p>
                                        <p>{order.shippingAddress?.address}</p>
                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Items ({order.items.length})</h4>
                                <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="py-2 flex gap-3">
                                            <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No orders found.</div>
                )}
            </div>
        </div>
    );
};
