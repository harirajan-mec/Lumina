import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../constants';
import { SIZES } from '../../types';

export const AddProductPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: '0',
        category: 'Men',
        image: '',
        description: '',
        fabric: '',
        fit: '',
        care: '',
        isNew: false,
        tags: ''
    });
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [colorInput, setColorInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const addColor = () => {
        if (colorInput && !selectedColors.includes(colorInput)) {
            setSelectedColors([...selectedColors, colorInput]);
            setColorInput('');
        }
    };

    const removeColor = (color: string) => {
        setSelectedColors(prev => prev.filter(c => c !== color));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const success = await productService.addProduct({
            name: formData.name,
            price: Number(formData.price),
            discount: Number(formData.discount),
            category: formData.category,
            image: formData.image,
            images: [formData.image], // Default to main image for now
            sizes: selectedSizes,
            colors: selectedColors,
            description: formData.description,
            fabric: formData.fabric,
            fit: formData.fit,
            care: formData.care,
            isNew: formData.isNew,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        });

        setLoading(false);
        if (success) {
            alert('Product added successfully!');
            navigate('/');
        } else {
            alert('Failed to add product.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2">
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                        <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount (%)</label>
                        <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                    <input type="url" name="image" required value={formData.image} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" placeholder="https://..." />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea name="description" required value={formData.description} onChange={handleChange} rows={4} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fabric</label>
                        <input type="text" name="fabric" required value={formData.fabric} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fit</label>
                        <input type="text" name="fit" required value={formData.fit} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Care</label>
                        <input type="text" name="care" required value={formData.care} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                        {SIZES.map(size => (
                            <button
                                type="button"
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`px-4 py-2 rounded-md border ${selectedSizes.includes(size) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Colors</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                            placeholder="Add a color..."
                        />
                        <button type="button" onClick={addColor} className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-lg">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedColors.map(color => (
                            <span key={color} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                                {color}
                                <button type="button" onClick={() => removeColor(color)} className="text-red-500">&times;</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                    <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2" placeholder="summer, casual, cotton" />
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="isNew" id="isNew" checked={formData.isNew} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 rounded" />
                    <label htmlFor="isNew" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as New Arrival</label>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50">
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};
