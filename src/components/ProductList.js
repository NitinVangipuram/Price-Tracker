// import React from 'react';
// import Swal from "sweetalert2";
// function ProductList({ products, productData }) {
//   const deleteProduct = (id) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire(
//           'Deleted!',
//           'Your file has been deleted.',
//           'success'
//         )


//       }
//     })}
    
//   return (
//     <div className='product-list'>
//       <h2>Product Data</h2>
//       <ul>
//         {Object.entries(productData).map(([url, data]) => (
//           <li key={url}>
//             <strong>Product Name:</strong> {data.name},{' '}
//             <strong>Desired Price:</strong> {data.desiredPrice},{' '}
//             <strong>Price:</strong> {data.price}
//             <br />
//             <img src={data.image} alt={data.name} />
//             <button onClick={deleteProduct(data.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ProductList;



import React from 'react';
import Swal from 'sweetalert2';

function ProductList({ products, productData, setProductData }) {
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
      <h2>Product Data</h2>
      <ul>
        {Object.entries(productData).map(([url, data]) => (
          <li key={url}>
          <div className='card'>
            <div className='left-card'>
            <label>{data.name.slice(0,15)}</label>
            <label> your price :{data.desiredPrice}</label> 
            <label>current price:{data.price}</label> 
            <button onClick={() => deleteProduct(data.id)}>Delete</button>
            <br />
            </div>
            <div className='right-card'>
            
            <img src={data.image} alt={data.name} />
           </div>
           </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
