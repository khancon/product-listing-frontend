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
    description?: string | null;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    // const [prevProducts, setPrevProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const BASE_URL = 'https://qrbgumsmdq.us-east-1.awsapprunner.com';

    // console.log(`BASE URL: ${BASE_URL}`);
    // console.log(`REACT_APP_ENV: ${process.env.REACT_APP_ENV || "REACT_APP_ENV not found"}`)

    const fetchProducts = async () => {
        handleGetAll();
    }

    const handleGetAll = async () => {
        try {
            console.log(`GET request for all products:`);
            const response = await axios.get(`${BASE_URL}/api/products`);
            response.data.map((p: Product) => {
                p.description = p.description === 'null' || !p.description ? null : p.description;
            });
            console.log(`GET response for all products:`);
            console.log(response)
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    console.log("BEFORE USE EFFECTS");
    
    useEffect(() => {
        console.log("INSIDE USE EFFECTS");
        fetchProducts();
    }, []);


    const onOptimisticProductUpdate = (newProduct: any, action: string) => {
        console.log(`PRODUCT TO ${action}: `);
        console.log(newProduct);
        console.log('STORING PREV PRODUCTS ARRAY');
        const prevProducts = [...products];
        console.log(prevProducts)
        // setPrevProducts([...products]);
        switch(action){
            case "add": 
                let updatedProducts = [...products];
                const index = products.findIndex(p => p.id === newProduct.id);
                if (index !== -1){
                    updatedProducts[index] = newProduct;
                } else {
                    updatedProducts = [...products, newProduct];
                }
                console.log(`OPTIMISTIC PRODUCT ADD REQUEST w/ INDEX ${index}: `)
                console.log(updatedProducts)
                setProducts(updatedProducts);
                // console.log(`OPTIMISTIC PRODUCT ADD RESULT w/ INDEX ${index}: `);
                // console.log(products);
                break;
            case "remove":
                const filteredProducts = products.filter(p => p.id !== newProduct.id);
                console.log(`OPTIMISTIC PRODUCT REMOVE REQUEST w/ ID ${newProduct.id}: `)
                console.log(filteredProducts)
                setProducts(filteredProducts);
                // console.log(`OPTIMISTIC PRODUCT REMOVE RESULT w/ INDEX ${newProduct.id}: `);
                // console.log(products);
                break;
            case "revert":
                // set products back to prev state
                console.log('REVERTING PRODUCTS BACK TO PREV STATE:');
                console.log(prevProducts);
                setProducts(prevProducts);
                break;
            default:
                break;
        }
    }

    console.log("AFTER USE EFFECTS -- ");
    console.log(products);

    return (
        <div>
            <h1>Product List</h1>
            <ProductForm onProductUpdate={onOptimisticProductUpdate} refreshProductList={fetchProducts} />
            <div>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onProductUpdate={onOptimisticProductUpdate} refreshProductList={fetchProducts} />
                ))}
            </div>
            {error && (<p style={{color: 'red'}}>Error: {error}</p>)}
            {loading && <LoadingSpinner />}
        </div>
    );
}

export default ProductList;