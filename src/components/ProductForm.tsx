import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

interface ProductFormProps {
    refreshProductList: any; // Callback to refresh product list
    initialData?: { id?: number; name: string; price: number; description?: string | null }; // Data for editing a product
    updateData?: boolean;
    onProductUpdate: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ refreshProductList, initialData, updateData, onProductUpdate }) => {
    const [id, setId] = useState<number | ''>(initialData?.id || '');
    const [name, setName] = useState<string>(initialData?.name || '');
    const [price, setPrice] = useState<number | ''>(initialData?.price || '');
    const [description, setDescription] = useState(initialData?.description);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        handlePost();
    };

    const handlePost = async() => {
        // Validate input
        if (!name || price === '') {
            setError('Name and price are required.');
            return;
        }

        if (updateData && !id){
            setError('Id required for updating data.');
            return;
        }

        const payload = { name, price: Number(price), description: !description ? null : description};
        console.log(`POST request payload:`);
        console.log(payload);
        const tempProduct = {id: Date.now(), ...payload};
        onProductUpdate(tempProduct, 'add');

        try {
            // Add product (POST request)
            const response = await axios.post(`${BASE_URL}/api/products`, payload)
            console.log("POST response: ");
            console.log(response);
            onProductUpdate(response.data, 'add');
            setId('');
            setName('');
            setPrice('');
            setDescription(null);
        } catch (err) {
            onProductUpdate(tempProduct, 'revert');
            setError('Failed to submit the form.');
            console.error(err);
        }

        // refreshProductList(); // Refresh product list on success
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
                <div style={{ marginBottom: '8px' }}>
                    <label>
                        Description:
                        <input
                            type="text"
                            value={description || ''}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter product description"
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
