import React, { useState } from 'react';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import { useEffect } from 'react';
import './App.css';

function App() {
  const API_Url ='http://localhost:3500/products';
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({});
  useEffect(() => {
    fetch(API_Url)
    .then((res) => res.json())
    .then((data) => setProductData(data));
  }, []);

  const addProduct = async (product) => {
    try {
      const response = await fetch("http://localhost:3001/productData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to send product data.");
      }

      const data = await response.json();

      if (data) {
        setProductData({ ...productData, [product.productUrl]: data, });
        setProducts([...products, product]);
        fetch(API_Url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        
      }
    } catch (error) {
      console.error("Error sending product data:", error);
    }
  };

  return (
    <div >
    <div className='imp'>
      {/* <h1>Price Tracker</h1> */}
      <AddProduct onAddProduct={addProduct} />
      </div>
      <ProductList products={products} productData={productData} />
      
    </div>
  );
}

export default App;
