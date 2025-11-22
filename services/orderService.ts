import { supabase } from '../src/lib/supabase';
import { Order, CartItem } from '../types';

export const orderService = {
    async createOrder(order: Order, userId: string): Promise<boolean> {
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: userId,
                total: order.total,
                status: order.status,
                payment_method: order.paymentMethod,
                shipping_address: order.shippingAddress
            }])
            .select()
            .single();

        if (orderError || !orderData) {
            console.error('Error creating order:', orderError);
            return false;
        }

        const orderItems = order.items.map(item => ({
            order_id: orderData.id,
            product_id: item.product.id,
            size: item.size,
            quantity: item.quantity,
            price_at_purchase: item.product.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Error creating order items:', itemsError);
            return false;
        }

        return true;
    },

    async getUserOrders(userId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user orders:', error);
            return [];
        }

        return data.map((order: any) => ({
            id: order.id,
            date: new Date(order.created_at).toLocaleDateString(),
            total: Number(order.total),
            status: order.status,
            paymentMethod: order.payment_method,
            shippingAddress: order.shipping_address,
            items: order.order_items.map((item: any) => ({
                product: {
                    id: item.products.id,
                    name: item.products.name,
                    price: Number(item.products.price),
                    image: item.products.image,
                    // ... map other product fields if needed for display
                },
                size: item.size,
                quantity: item.quantity
            }))
        }));
    },

    async getAllOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        profiles (email, name),
        order_items (
          *,
          products (*)
        )
      `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all orders:', error);
            return [];
        }

        return data.map((order: any) => ({
            id: order.id,
            date: new Date(order.created_at).toLocaleDateString(),
            total: Number(order.total),
            status: order.status,
            paymentMethod: order.payment_method,
            shippingAddress: order.shipping_address,
            user: {
                name: order.profiles?.name || 'Unknown',
                email: order.profiles?.email || ''
            },
            items: order.order_items.map((item: any) => ({
                product: {
                    id: item.products.id,
                    name: item.products.name,
                    price: Number(item.products.price),
                    image: item.products.image,
                },
                size: item.size,
                quantity: item.quantity
            }))
        }));
    }
};
