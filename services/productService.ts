import { supabase } from '../src/lib/supabase';
import { Product } from '../types';

export const productService = {
    async getProducts(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        // Map Supabase data to Product interface if needed
        // Currently the schema matches closely, but we ensure types
        return data.map((item: any) => ({
            id: Number(item.id), // Ensure ID is number as per types.ts
            name: item.name,
            price: Number(item.price),
            discount: Number(item.discount),
            category: item.category,
            image: item.image,
            images: item.images || [],
            rating: Number(item.rating),
            reviews: item.reviews_count || 0, // Map reviews_count to reviews
            sizes: item.sizes || [],
            colors: item.colors || [],
            description: item.description,
            fabric: item.fabric,
            fit: item.fit,
            care: item.care,
            isNew: item.is_new, // Map snake_case to camelCase
            tags: item.tags || []
        }));
    },

    async getProductById(id: number): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
        }

        if (!data) return null;

        return {
            id: Number(data.id),
            name: data.name,
            price: Number(data.price),
            discount: Number(data.discount),
            category: data.category,
            image: data.image,
            images: data.images || [],
            rating: Number(data.rating),
            reviews: data.reviews_count || 0,
            sizes: data.sizes || [],
            colors: data.colors || [],
            description: data.description,
            fabric: data.fabric,
            fit: data.fit,
            care: data.care,
            isNew: data.is_new,
            tags: data.tags || []
        };
    },

    async addProduct(product: Omit<Product, 'id' | 'rating' | 'reviews'>): Promise<boolean> {
        const { error } = await supabase
            .from('products')
            .insert([{
                name: product.name,
                price: product.price,
                discount: product.discount,
                category: product.category,
                image: product.image,
                images: product.images,
                sizes: product.sizes,
                colors: product.colors,
                description: product.description,
                fabric: product.fabric,
                fit: product.fit,
                care: product.care,
                is_new: product.isNew,
                tags: product.tags
            }]);

        if (error) {
            console.error('Error adding product:', error);
            return false;
        }
        return true;
    }
};
