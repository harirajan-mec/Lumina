import React, { useContext } from 'react';
import { ShopContext } from '../App';
import { PRODUCTS } from '../constants'; // Keep for type reference if needed, or remove if unused. 
// Actually, we should remove it to avoid confusion.
// But wait, types might be needed.
// Let's just remove the import of PRODUCTS constant.
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useContext(ShopContext);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Save items you love to revisit them later.</p>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition inline-block shadow-lg shadow-indigo-200 dark:shadow-none">
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
          {wishlistProducts.length} items
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {wishlistProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};