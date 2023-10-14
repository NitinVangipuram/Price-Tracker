

import React from 'react';
import Swal from 'sweetalert2';
// import Card from 'react-bootstrap/Card';
import './ProductList.css';
function ProductList({ row }) {
  const API_Url ='http://localhost:3500/products';
  const deleteProduct = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Filter out the product with the matching ID
        fetch (`${API_Url}/${id}`, {
          method: 'DELETE',
        })

        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        window.location.reload();
      }
    });
  }

  return (
    <div className="product-list">
      {/* <h2>Product Data</h2> */}
      <header className="container">
      <h1>Shopping Cart</h1>

      <ul className="breadcrumb">
        <li>Your Items</li>
      </ul>

      <span className="count"> </span>
    </header>
      
        {Object.entries(productData).map(([url, data]) => (
          <section className='container'>
          <ul className="products">
          <li  className="row" key={url}>
           <div className="col left">
                <div className="thumbnail">
                  <a href="/">
                    <img src={data.image} alt={data.name} />
                  </a>
                </div>
                <div className="detail">
                  <div className="name">
                    <a href="/">{data.name.slice(0,15)}</a>
                  </div>
                  <div className="description">{data.name}</div>
                  <div className="price">{data.price}</div>
                </div>
              </div>

              <div className="col right">
              <button  className="todo-btn" onClick={() => deleteProduct(data.id)}>Delete</button>
              </div>

          </li>
          </ul>
          </section>
        ))}
      
    </div>
  );
}

export default ProductList;
