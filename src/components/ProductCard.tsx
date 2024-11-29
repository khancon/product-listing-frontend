import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import BASE_URL from '../config';

interface Product {
    id: number;
    name: string;
    price: number;
    description?: string | null;
}

interface ProductProps {
    product: Product;
    onProductUpdate: any;
    refreshProductList?: any;
}

const ProductCard: React.FC<ProductProps> = ({ product, onProductUpdate, refreshProductList }) => {
    const [editMode, setEditMode] = useState(false);
    const [updatedPrice, setUpdatedPrice] = useState<number | ''>(product.price || '');
    const [updatedDesc, setUpdateDesc] = useState(product.description);
    const [updatedName, setUpdatedName] = useState(product.name);
    const [error, setError] = useState<string | null>(null);

    const productCardStyle = { 
        border: '1px solid #ccc', 
        padding: '16px', 
        margin: '8px' 
    };

    const handleName = (name: string) => {
        setUpdatedName(name);
    };

    const handlePrice = (price: number | '') => {
        setUpdatedPrice(price);
    };

    const handlePut = async () => {
        //handle PUT request
        // e.preventDefault();
        setError(null);

        // Validate input
        if (!updatedName || updatedPrice === '') {
            setError('Name and price are required.');
            return;
        }

        const payload = { name: updatedName, price: Number(updatedPrice), description: !updatedDesc ? null : updatedDesc };
        // const updatedProduct = { id: product.id, ...payload};
        console.log(`PUT request for id#${product.id} and payload:`);
        console.log(payload);
        const tempProduct: Product = { id: product.id, ...payload };
        onProductUpdate(tempProduct, 'add');

        try {
            // Update product (PUT request)
            const response = await axios.put(`${BASE_URL}/api/products/${product.id}`, payload)

            console.log(`PUT response:`);
            console.log(response)
            onProductUpdate(response.data, 'add');

            setUpdatedName(response.data.name);
            setUpdatedPrice(response.data.price);
            setUpdateDesc(response.data.description);
            // setEditMode(false);
        } catch (err) {
            setError(`Failed to update the product with following error -- ${err}`);
            console.log(`Failed to update the product with following error -- ${err} -- Reverting...`);
            onProductUpdate(tempProduct, 'revert');
            console.error(err);
        }

        // refreshProductList();
        // onListUpdate(); //refresh list
        setEditMode(false);
    };

    const handleDelete = async () => {
        setError(null);
        console.log(`DELETE request for id#${product.id}`);
        onProductUpdate(product, 'remove');

        try{
            const response = await axios.delete(`${BASE_URL}/api/products/${product.id}`)
            // .catch((e: Error) => {
            //     console.error(e);
            //     // onProductUpdate(product, 'add');
            //     setError(`DELETE request failed: ${e.message}`);
            //     // return;
            // });
            console.log(`DELETE response`);
            console.log(response);
        } catch (err) {
            onProductUpdate(product, 'revert');
            setError(`Failed to delete product with following error -- ${err}`);
            console.error(err);
        }

        refreshProductList();
        alert(`Product #${product.id} deleted Successfully`)
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
                    {/* <p style={{ marginBottom: '8px' }}>ID: {product.id}</p> */}
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
                            value={updatedPrice === null ? '' : updatedPrice}
                            // defaultValue={product.name}
                            onChange={(e) => handlePrice(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Enter product price"
                        />
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                        <label>Description: </label>
                        <input 
                            type="text"
                            name="description"
                            value={updatedDesc || ''}
                            // defaultValue={product.name}
                            onChange={(e) => setUpdateDesc(e.target.value)}
                            placeholder="Enter product description"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
                        <button onClick={handlePut}>Update Product</button>
                        <button onClick={cancelUpdate}>Cancel</button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <div style={productCardStyle} id={product.id.toString()}>
                    <h2>{updatedName}</h2>
                    {/* <p>ID: {product.id}</p> */}
                    <p>Price: ${Number(updatedPrice).toFixed(2)}</p>
                    {updatedDesc && <p>Description: {updatedDesc}</p>}
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