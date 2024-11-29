import React from 'react';
// import './App.css';
import ProductList from './components/ProductList';
import BASE_URL from './config';

const App = () => {
  return (
    <div style={{ padding: '16px' }}>
      <ProductList />
      <p>Base URL -- {BASE_URL}</p>
      <p>ENV -- {process.env.REACT_APP_ENV || "REACT_APP_ENV not found"}</p>
    </div>
  );
}

export default App;
