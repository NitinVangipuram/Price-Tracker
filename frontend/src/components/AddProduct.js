import React, { useState } from 'react';
import '../Dashboard.css';
import Swal from "sweetalert2";
import axios from 'axios';
const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({});
  const [productUrl, setProductUrl] = useState('');
  const [desiredPrice, setDesiredPrice] = useState('');
  const onAddProduct = async (product) => {
    try { 
      const response = await axios.post("http://localhost:2000/productData", {
      
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
console.log(product);
      if (!response.ok) {
        throw new Error("Failed to send product data.");
      }

      const data = await response.json();

      if (data) {
        setProductData({ ...productData, [product.productUrl]: data, });
        setProducts([...products, product]);
      
      }
    } catch (error) {
      console.error("Error sending product data:", error);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productUrl || !desiredPrice) {
      //  alert('Please fill in all fields.');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields.',
        
      })
      
      return;
    }

    // Call the parent component's function to add the product
    onAddProduct({ productUrl, desiredPrice });
    Swal.fire(
      'Item Added!',
      'Your item has been added.',
      'success'
    )
    // Clear the input fields after adding the product
    setProductUrl('');
    setDesiredPrice('');
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
     
        <label className="custom-field two">
        {/* <span class="placeholder">Enter URL : </span> */}
          <input
            type="url"
            className="todo-input"
            placeholder="Enter URL"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
          />
        
        </label>
        <label className="custom-field two">
        {/* <span class="placeholder">Desired price:   </span> */}
          <input
            type="number"
            value={desiredPrice}
            placeholder='Desired price'
           className='todo-input'
            onChange={(e) => setDesiredPrice(e.target.value)}
          />
          
        </label>
        <button className="todo-btn" type="submit">Add</button>
      </form>
      
    </div>
  );
};

export default AddProduct;
