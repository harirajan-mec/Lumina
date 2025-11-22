import React, { useState, useEffect, useMemo, useContext } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { CartDrawer } from './components/CartDrawer';
import { GeminiStylist } from './components/GeminiStylist';
import { DebugConsole } from './components/DebugConsole';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AdminRoute } from './components/AdminRoute';
import { AddProductPage } from './components/admin/AddProductPage';
import { AdminOrdersPage } from './components/admin/AdminOrdersPage';
import { CheckoutPage } from './components/CheckoutPage';
import { WishlistPage } from './components/WishlistPage';
import { OrdersPage } from './components/OrdersPage';
import { Carousel, Slide } from './components/Carousel';
import { CATEGORIES, HOME_SLIDES } from './constants';
import { Product, CartItem, FilterState, SortOption, User, Order } from './types';
import { dispatchLog } from './services/geminiService';
import { productService } from './services/productService';
import { supabase } from './src/lib/supabase';

// --- Context Definitions ---
export const ShopContext = React.createContext<{
  cart: CartItem[];
  wishlist: number[];
  user: User | null;
  orders: Order[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  addOrder: (order: Order) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  products: Product[];
}>({
  cart: [],
  wishlist: [],
  user: null,
  orders: [],
  addToCart: () => { },
  removeFromCart: () => { },
  updateQuantity: () => { },
  clearCart: () => { },
  toggleWishlist: () => { },
  addOrder: () => { },
  isCartOpen: false,
  setIsCartOpen: () => { },
  logout: () => { },
  theme: 'light',
  toggleTheme: () => { },
  products: [],
});

// --- Main Home Page Component ---
const HomePage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { products } = useContext(ShopContext);

  // Determine active category from URL or default to 'All'
  const activeCategory = useMemo(() => {
    if (!category) return 'All';
    const decoded = decodeURIComponent(category);
    // Handle specific casing or mapping if needed
    if (decoded.toLowerCase() === 'new arrivals') return 'New Arrivals';
    if (decoded.toLowerCase() === 'offers') return 'Offers';
    // Default capitalization (e.g. "men" -> "Men")
    return decoded.charAt(0).toUpperCase() + decoded.slice(1);
  }, [category]);

  const isLandingPage = !category; // If no category param, it's the main Landing Page

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    colors: [],
    sizes: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.NEWEST);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory || (activeCategory === 'New Arrivals' && p.isNew) || (activeCategory === 'Offers' && p.discount > 0));
    }

    // Apply filters only if NOT in 'All' mode
    if (sortBy !== SortOption.ALL) {
      // Price
      result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

      // Color
      if (filters.colors.length > 0) {
        result = result.filter(p => p.colors.some(c => filters.colors.includes(c)));
      }

      // Size
      if (filters.sizes.length > 0) {
        result = result.filter(p => p.sizes.some(s => filters.sizes.includes(s)));
      }
    }

    // Sort
    switch (sortBy) {
      case SortOption.PRICE_LOW_HIGH:
        result.sort((a, b) => a.price - b.price);
        break;
      case SortOption.PRICE_HIGH_LOW:
        result.sort((a, b) => b.price - a.price);
        break;
      case SortOption.RATING:
        result.sort((a, b) => b.rating - a.rating);
        break;
      case SortOption.ALL:
      default: // NEWEST
        // Assuming higher ID is newer for mock data
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [activeCategory, filters, sortBy]);

  const toggleColorFilter = (color: string) => {
    if (sortBy === SortOption.ALL) {
      setSortBy(SortOption.NEWEST);
    }
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color) ? prev.colors.filter(c => c !== color) : [...prev.colors, color]
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sortBy === SortOption.ALL) {
      setSortBy(SortOption.NEWEST);
    }
    setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }));
  };

  // Handle sidebar navigation
  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      navigate('/');
    } else {
      navigate(`/category/${cat.toLowerCase()}`);
    }
  };

  // Dynamic Slides logic
  const slides: Slide[] = useMemo(() => {
    if (isLandingPage) {
      return HOME_SLIDES;
    }

    // Create a single slide for specific categories to act as a banner
    let slideData: Partial<Slide>;
    switch (activeCategory) {
      case 'Men':
        slideData = {
          image: "https://picsum.photos/id/1005/1600/600",
          title: "Men's Collection",
          subtitle: "Sharp looks for the modern man.",
          btnText: "Browse Men",
          link: "/category/men"
        }; break;
      case 'Women':
        slideData = {
          image: "https://picsum.photos/id/338/1600/600",
          title: "Women's Fashion",
          subtitle: "Elegance in every stitch.",
          btnText: "Browse Women",
          link: "/category/women"
        }; break;
      case 'Kids':
        slideData = {
          image: "https://picsum.photos/id/177/1600/600",
          title: "Kids' Corner",
          subtitle: "Playful styles for little ones.",
          btnText: "Browse Kids",
          link: "/category/kids"
        }; break;
      case 'New Arrivals':
        slideData = {
          image: "https://picsum.photos/id/103/1600/600",
          title: "Just Landed",
          subtitle: "Be the first to wear the trend.",
          btnText: "Shop New",
          link: "/category/new%20arrivals"
        }; break;
      case 'Offers':
        slideData = {
          image: "https://picsum.photos/id/870/1600/600",
          title: "Exclusive Offers",
          subtitle: "Great deals on premium styles.",
          btnText: "Shop Sale",
          link: "/category/offers"
        }; break;
      default:
        slideData = {
          image: "https://picsum.photos/id/445/1600/600",
          title: `${activeCategory} Collection`,
          subtitle: "Upgrade your wardrobe with the latest trends.",
          btnText: "Shop Now",
          link: "#"
        };
    }

    return [{ ...slideData, id: 99, align: 'center' } as Slide];
  }, [activeCategory, isLandingPage]);

  const sortOptions = [
    { value: SortOption.ALL, label: 'All' },
    { value: SortOption.NEWEST, label: 'Newest Arrivals' },
    { value: SortOption.PRICE_LOW_HIGH, label: 'Price: Low to High' },
    { value: SortOption.PRICE_HIGH_LOW, label: 'Price: High to Low' },
    { value: SortOption.RATING, label: 'Best Rating' },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label;

  // LANDING PAGE RENDER
  if (isLandingPage) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
        {/* Hero Carousel */}
        <Carousel slides={HOME_SLIDES} autoPlay={true} />

        {/* Features */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over ₹100" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🛡️", title: "Secure Payment", desc: "100% protected" },
            { icon: "🎧", title: "24/7 Support", desc: "We're here to help" }
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-3xl mb-2">{feature.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Categories Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Men", img: "https://picsum.photos/id/1005/600/400", link: "/category/men" },
              { name: "Women", img: "https://picsum.photos/id/338/600/400", link: "/category/women" },
              { name: "Kids", img: "https://picsum.photos/id/177/600/400", link: "/category/kids" }
            ].map((cat) => (
              <Link key={cat.name} to={cat.link} className="group relative h-64 rounded-2xl overflow-hidden shadow-lg">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">{cat.name}</h3>
                    <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                      Explore <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
            <Link to="/category/all" className="text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 text-sm">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    );
  }

  // CATEGORY / FILTER PAGE RENDER
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Carousel (Single Slide Banner) */}
      <div className="mb-12">
        <Carousel slides={slides} autoPlay={false} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold mb-4 dark:text-white">Categories</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0 lg:overflow-visible lg:space-y-2 no-scrollbar">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    lg:w-full lg:text-left lg:rounded-md lg:px-3 lg:py-2 lg:whitespace-normal
                    ${activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md lg:bg-gray-100 lg:text-indigo-700 lg:shadow-none dark:lg:bg-gray-800 dark:lg:text-indigo-400'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 lg:border-none lg:bg-transparent lg:hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 dark:text-white">Price Range</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>₹{filters.priceRange[0]}</span>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={handlePriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 dark:text-white">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {['Black', 'White', 'Blue', 'Red', 'Green', 'Beige'].map(color => (
                <button
                  key={color}
                  onClick={() => toggleColorFilter(color)}
                  className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-transform ${filters.colors.includes(color) ? 'ring-2 ring-offset-2 ring-gray-800 scale-110 dark:ring-gray-200' : ''}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeCategory}</h2>

            {/* Custom Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm min-w-[180px] justify-between"
              >
                <span>{currentSortLabel}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20 origin-top-right animate-fade-in-up">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            if (option.value === SortOption.ALL) {
                              setFilters({
                                priceRange: [0, 1000],
                                colors: [],
                                sizes: [],
                              });
                            }
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${sortBy === option.value
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                          {option.label}
                          {sortBy === option.value && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              No products found in {activeCategory}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

// Wrapper to handle authenticated layout vs public layout
const AppContent: React.FC = () => {
  const { user } = useContext(ShopContext);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Only show Navbar if logged in */}
      {user && <Navbar />}

      <div className="flex-grow">
        <Routes>
          {/* Public Routes (Login/Signup) */}
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" replace />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" replace />}
          />
          {/* Category Routes */}
          <Route
            path="/category/:category"
            element={user ? <HomePage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/product/:id"
            element={user ? <ProductDetails /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/checkout"
            element={user ? <CheckoutPage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/wishlist"
            element={user ? <WishlistPage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/orders"
            element={user ? <OrdersPage /> : <Navigate to="/login" replace />}
          />

          {/* Catch all */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/add-product" element={
            <AdminRoute>
              <AddProductPage />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          } />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </div>

      {/* Only show these if logged in */}
      {user && <Footer />}
      {user && <CartDrawer />}
      {user && <GeminiStylist />}

      {/* Debug console available everywhere for dev purposes */}
      <DebugConsole />
    </div>
  );
}

// --- App Component ---
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any | null>(null); // Use 'any' or Supabase User type
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch Products
  useEffect(() => {
    const loadProducts = async () => {
      const data = await productService.getProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  // Apply theme class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Cart Logic
  const addToCart = (product: Product, size: string) => {
    // Open cart sidebar immediately for better UX
    // But do it OUTSIDE the state updater to avoid side-effects during render phase
    setTimeout(() => setIsCartOpen(true), 0);

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item =>
          (item.product.id === product.id && item.size === size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: number, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.size === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  // Auth Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Map Supabase user to our User type
        setUser({
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url
        });
      } else {
        setUser(null);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url
        });
        dispatchLog('info', 'User Logged In', { email: session.user.email });
      } else {
        setUser(null);
        dispatchLog('info', 'User Logged Out');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCart([]); // Clear cart on logout
    setWishlist([]);
    setOrders([]);
  };

  // Scroll to top on route change
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };

  return (
    <ShopContext.Provider value={{ cart, wishlist, orders, user, addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist, addOrder, isCartOpen, setIsCartOpen, logout, theme, toggleTheme, products }}>
      <HashRouter>
        <ScrollToTop />
        <AppContent />
      </HashRouter>
    </ShopContext.Provider>
  );
}