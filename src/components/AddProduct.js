import React, { useState } from 'react';

import Swal from "sweetalert2";

const AddProduct = ({ onAddProduct }) => {
 
  const [productUrl, setProductUrl] = useState('');
  const [desiredPrice, setDesiredPrice] = useState('');

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
        <span class="placeholder">Enter URL : </span>
          <input
            type="url"
           
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
          />
        
        </label>
        <label className="custom-field two">
        <span class="placeholder">Desired price:   </span>
          <input
            type="number"
            value={desiredPrice}
           
            onChange={(e) => setDesiredPrice(e.target.value)}
          />
          
        </label>
        <button className="b" type="submit">Add</button>
      </form>
      
    </div>
  );
};

export default AddProduct;
