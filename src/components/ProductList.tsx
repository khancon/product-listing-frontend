import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ProductForm from './ProductForm';
import BASE_URL from '../config';

interface Product {
    id: number;
    name: string;
    price: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const BASE_URL = 'https://qrbgumsmdq.us-east-1.awsapprunner.com';

    console.log(`BASE URL: ${BASE_URL}`);
    console.log(`REACT_APP_ENV: ${process.env.REACT_APP_ENV || "REACT_APP_ENV not found"}`)

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/products`);
            console.log(response);
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <LoadingSpinner />
    }
    if (error) {
        const errStyle = {
            color: 'red'
        };
        return <p style={errStyle}>Error: {error}</p>
    } 

    return (
        <div>
            <h1>Product List</h1>
            {/* <ProductForm onSubmitSuccess={fetchProducts} updateData={true}/> */}
            <ProductForm onSubmitSuccess={fetchProducts} />
            <div>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onUpdate={fetchProducts}/>
                ))}
            </div>
        </div>
    );
}

export default ProductList;