import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../App';
import { generateProductAdvice } from '../services/geminiService';

export const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart, products } = useContext(ShopContext);
    const product = products.find(p => p.id === Number(id));

    // Auto-select the first size to improve UX
    const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || '');
    const [activeImage, setActiveImage] = useState(product?.image || '');
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);

    // Sync state if product ID changes or loads late
    useEffect(() => {
        if (product) {
            setSelectedSize(product.sizes?.[0] || '');
            setActiveImage(product.image);
        }
    }, [product]);

    if (!product) return <div className="p-10 text-center dark:text-white">Product not found. <button onClick={() => navigate('/')} className="text-indigo-600 underline">Go Home</button></div>;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        addToCart(product, selectedSize);
    };

    const handleAskAi = async () => {
        if (!aiQuestion.trim()) return;
        setLoadingAi(true);
        const answer = await generateProductAdvice(product.name, aiQuestion);
        setAiAnswer(answer);
        setLoadingAi(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <button
                            onClick={() => setActiveImage(product.image)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 ${activeImage === product.image ? 'border-indigo-600' : 'border-transparent'}`}
                        >
                            <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                        {product.images.slice(1).map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`aspect-square rounded-lg overflow-hidden border-2 ${activeImage === img ? 'border-indigo-600' : 'border-transparent'}`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Column */}
                <div>
                    <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400">({product.reviews} reviews)</span>
                                </div>
                            </div>
                            <p className="text-2xl font-medium text-gray-900 dark:text-white">₹{product.price}</p>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Selectors */}
                    <div className="space-y-6 mb-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-white">Size</label>
                                <button className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 rounded-md text-sm font-medium border transition-colors ${selectedSize === size
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-gray-900 dark:text-gray-200">
                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Fabric</span>
                                <span className="font-medium">{product.fabric}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-gray-900 dark:text-gray-200">
                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Fit</span>
                                <span className="font-medium">{product.fit}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded col-span-2 text-gray-900 dark:text-gray-200">
                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Care Instructions</span>
                                <span className="font-medium">{product.care}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mb-10">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            Add to Cart
                        </button>
                        <button className="px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>
                    </div>

                    {/* AI Helper Section */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-indigo-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">✨</span>
                            <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">Ask about this item</h3>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={aiQuestion}
                                onChange={(e) => setAiQuestion(e.target.value)}
                                placeholder="E.g., Does this match blue jeans?"
                                className="flex-1 border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                onClick={handleAskAi}
                                disabled={loadingAi}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {loadingAi ? '...' : 'Ask'}
                            </button>
                        </div>
                        {aiAnswer && (
                            <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-indigo-100 dark:border-gray-700 animate-fade-in">
                                {aiAnswer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};