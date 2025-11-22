export interface Product {
  id: number;
  name: string;
  price: number;
  discount: number; // percentage off
  category: string;
  image: string;
  images: string[]; // Extra images
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  description: string;
  fabric: string;
  fit: string;
  care: string;
  isNew?: boolean;
  tags?: string[]; // For AI search
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface FilterState {
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
}

export enum SortOption {
  NEWEST = 'NEWEST',
  PRICE_LOW_HIGH = 'PRICE_LOW_HIGH',
  PRICE_HIGH_LOW = 'PRICE_HIGH_LOW',
  RATING = 'RATING',
  ALL = 'ALL',
}

export interface User {
  id?: string; // Optional for now to avoid breaking other things immediately
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];