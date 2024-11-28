import axios from 'axios';
import React, { useState } from 'react';
import BASE_URL from '../config';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface ProductProps {
    product: Product;
    onUpdate: any;
}

const ProductCard: React.FC<ProductProps> = ({ product, onUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [updatedPrice, setUpdatedPrice] = useState<number | ''>(product.price || '');
    const [updatedName, setUpdatedName] = useState(product.name);
    const [error, setError] = useState<string | null>(null);

    const productCardStyle = { 
        border: '1px solid #ccc', 
        padding: '16px', 
        margin: '8px' 
    };

    const handleName = (name: string) => {
        // if (!name){
        //     setError("Name cannot be empty");
        //     return;
        // } else {
        setUpdatedName(name);
        // }
    };

    const handlePrice = (price: number | '') => {
        // if(price === ''){
        //     setError("Price cannot be empty");
        //     return;
        // } else {
        setUpdatedPrice(price);
        // }
    };

    const handleUpdate = async () => {
        //handle PUT request
        // e.preventDefault();
        setError(null);

        // Validate input
        if (!updatedName || updatedPrice === '') {
            setError('Name and price are required.');
            return;
        }

        const payload = { name: updatedName, price: Number(updatedPrice)};

        try {
            // Update product (PUT request)
            const response = await axios
                .put(`${BASE_URL}/api/products/${product.id}`, payload)
                .catch((e: Error) => {
                    console.error(e);
                    setError(`PUT request failed: ${e.message}`)
                });
            
            console.log(`PUT response -- ${response}`)
            onUpdate(); // Refresh product list on success
            // setId('');
            // setName('');
            // setPrice('');
            setEditMode(false);
        } catch (err) {
            setError('Failed to submit the form.');
        }

        onUpdate(); //refresh list
        setEditMode(false);
    };

    const handleDelete = async () => {
        setError(null);
        const response = await axios
            .delete(`${BASE_URL}/api/products/${product.id}`)
            .catch((e: Error) => {
                console.error(e);
                setError(`DELETE request failed: ${e.message}`);
                // return;
            });
        console.log(`DELETE response -- ${response}`)
        alert(`Product #${product.id} deleted Successfully`)
        onUpdate();
    };

    const toggleEditMode = () => {
        console.log("Edit mode -- toggled!");
        setEditMode(!editMode);
    };

    const cancelUpdate = () => {
        toggleEditMode();
        setError(null);
    };

    return (
        <div>
            {editMode ? (
                <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px' }} id={product.id.toString()}>
                    <p style={{ marginBottom: '8px' }}>ID: {product.id}</p>
                    <div style={{ marginBottom: '8px' }}>
                        <label>Name: </label>
                        <input 
                            type="text"
                            name="name"
                            value={updatedName}
                            // defaultValue={product.name}
                            onChange={(e) => handleName(e.target.value)}
                            placeholder="Enter product name"
                        />
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <label>Price: </label>
                        <input 
                            type="number"
                            name="price"
                            value={updatedPrice === '' ? '' : updatedPrice}
                            // defaultValue={product.name}
                            onChange={(e) => handlePrice(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Enter product price"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                        <button onClick={handleUpdate}>Update Product</button>
                        <button onClick={cancelUpdate}>Cancel</button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <div style={productCardStyle} id={product.id.toString()}>
                    <h2>{product.name}</h2>
                    <p>ID: {product.id}</p>
                    <p>Price: {product.price.toFixed(2)}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                        <button onClick={toggleEditMode}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>)
            }
        </div>
    );
}

export default ProductCard;