import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Lumina<span className="text-indigo-500">.</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Redefining modern fashion with quality, sustainability, and AI-driven personalization.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white">Men</a></li>
              <li><a href="#" className="hover:text-white">Women</a></li>
              <li><a href="#" className="hover:text-white">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Order Status</a></li>
              <li><a href="#" className="hover:text-white">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white">Size Guide</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Stay in the loop</h4>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-gray-800 border-none text-sm rounded px-3 py-2 w-full focus:ring-1 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; 2025 Lumina Fashion. All rights reserved.
        </div>
      </div>
    </footer>
  );
};