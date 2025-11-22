import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShopContext } from '../App';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, wishlist, addToCart } = useContext(ShopContext);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Link to={`/product/${product.id}`}>
            <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
                <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-600 text-xs font-bold text-white tracking-wide uppercase">
                New
                </span>
            )}
            {product.discount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded bg-red-500 text-xs font-bold text-white tracking-wide uppercase">
                -{product.discount}%
                </span>
            )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 text-gray-900 dark:text-white shadow-sm backdrop-blur transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isWishlisted ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 ${isWishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <button 
            onClick={() => addToCart(product, product.sizes[0])}
            className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium py-3 rounded shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{product.price}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
        
        {/* Colors preview */}
        <div className="flex gap-1">
            {product.colors.map((color, idx) => (
                <div 
                    key={idx} 
                    className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-600" 
                    style={{ backgroundColor: color.toLowerCase() }}
                />
            ))}
        </div>
      </div>
    </div>
  );
};