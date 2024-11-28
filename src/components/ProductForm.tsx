import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

interface ProductFormProps {
    onSubmitSuccess: () => void; // Callback to refresh product list
    initialData?: { id?: number; name: string; price: number }; // Data for editing a product
    // productId?: number; // ID for updating an existing product
    updateData?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmitSuccess, initialData, updateData }) => {
    const [id, setId] = useState<number | ''>(initialData?.id || '');
    const [name, setName] = useState<string>(initialData?.name || '');
    // const [id, setId] = useState<number | null>(initialData?.id || null);
    // const [productId, setProductId] = useState<number>(productId? || '');
    const [price, setPrice] = useState<number | ''>(initialData?.price || '');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate input
        if (!name || price === '') {
            setError('Name and price are required.');
            return;
        }

        if (updateData && !id){
            setError('Id required for updating data.');
            return;
        }

        const payload = { name, price: Number(price) };

        try {
            if (id) {
                // Update product (PUT request)
                await axios
                    .put(`${BASE_URL}/api/products/${id}`, payload)
                    .catch((e: Error) => {
                        console.error(e);
                        setError(`PUT request failed: ${e.message}`)
                    });
            } else {
                // Add product (POST request)
                await axios
                    .post(`${BASE_URL}/api/products`, payload)
                    .catch((e: Error) => {
                        console.error(e);
                        setError(`POST request failed: ${e.message}`)
                    });
            }

            onSubmitSuccess(); // Refresh product list on success
            setId('');
            setName('');
            setPrice('');
        } catch (err) {
            setError('Failed to submit the form.');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px' }}>
            <h2>{updateData ? 'Update Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
                {updateData && <div style={{ marginBottom: '8px' }}>
                    <label>
                        ID:
                        <input
                            type="number"
                            value={id}
                            onChange={(e) => setId(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Enter ID"
                        />
                    </label>
                </div>}
                <div style={{ marginBottom: '8px' }}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <label>
                        Price:
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Enter product price"
                        />
                    </label>
                </div>
                <button type="submit">{updateData ? 'Update Product' : 'Add Product'}</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ProductForm;
