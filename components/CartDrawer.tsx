import React, { useContext } from 'react';
import { ShopContext } from '../App';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity } = useContext(ShopContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (!isCartOpen) return null;

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700">
          <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
            
            {/* Header */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shopping Cart</h2>
                <button
                  type="button"
                  className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setIsCartOpen(false)}
                >
                  <span className="sr-only">Close panel</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-8">
                {cart.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty.</p>
                        <button 
                            onClick={() => setIsCartOpen(false)}
                            className="text-indigo-600 font-medium hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Continue Shopping &rarr;
                        </button>
                    </div>
                ) : (
                    <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                        {cart.map((item) => (
                        <li key={`${item.product.id}-${item.size}`} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-full w-full object-cover object-center"
                            />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                            <div>
                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <h3>{item.product.name}</h3>
                                <p className="ml-4">₹{item.product.price * item.quantity}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.product.category}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <span>Size: {item.size}</span>
                                    <span className="text-gray-300 dark:text-gray-600">|</span>
                                    <div className="flex items-center border dark:border-gray-600 rounded">
                                        <button onClick={() => updateQuantity(item.product.id, item.size, -1)} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">-</button>
                                        <span className="px-2">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.size, 1)} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">+</button>
                                    </div>
                                </div>

                                <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id, item.size)}
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                >
                                Remove
                                </button>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <p>Subtotal</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <button
                  disabled={cart.length === 0}
                  className={`w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (cart.length > 0) {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }
                  }}
                >
                  Checkout
                </button>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  or{' '}
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};