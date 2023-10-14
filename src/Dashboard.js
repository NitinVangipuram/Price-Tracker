
// // import React, { Component } from 'react';
// // import AddProduct from './components/AddProduct';
// // import './Dashboard.css';
// // import swal from 'sweetalert';
// // import { withRouter } from './utils';
// // import {
// //   Button, TextField, Dialog, DialogActions, LinearProgress,
// //   DialogTitle, DialogContent, TableBody, Table,
// //   TableContainer, TableHead, TableRow, TableCell
// // } from '@material-ui/core';
// // import { Pagination } from '@material-ui/lab';
// // const axios = require('axios');

// // class Dashboard extends Component {
// //   constructor() {
// //     super();
// //     this.state = {
// //       token: '',
// //       openProductModal: true,
// //       openProductEditModal: true,
// //       id: '',
// //       name: '',
// //       desc: '',
// //       price: '',
// //       discount: '',
// //       file: '',
// //       fileName: '',
// //       page: 1,
// //       search: '',
// //       products: [],
// //       pages: 0,
// //       loading: false
// //     };
// //   }

// //   componentDidMount = () => {
// //     let token = localStorage.getItem('token');
// //     if (!token) {
// //       // this.props.history.push('/login');
// //       this.props.navigate("/login");
// //     } else {
// //       this.setState({ token: token }, () => {
// //         this.getProduct();
// //       });
// //     }
// //   }

// //   getProduct = () => {
    
// //     this.setState({ loading: true });

// //     let data = '?';
// //     data = `${data}page=${this.state.page}`;
// //     if (this.state.search) {
// //       data = `${data}&search=${this.state.search}`;
// //     }
// //     axios.get(`http://localhost:2000/get-product${data}`, {
// //       headers: {
// //         'token': this.state.token
// //       }
// //     }).then((res) => {
// //       this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
// //     }).catch((err) => {
// //       swal({
// //         text: err.response.data.errorMessage,
// //         icon: "error",
// //         type: "error"
// //       });
// //       this.setState({ loading: false, products: [], pages: 0 },()=>{});
// //     });
// //   }

// //   deleteProduct = (id) => {
// //     axios.post('http://localhost:2000/delete-product', {
// //       id: id
// //     }, {
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'token': this.state.token
// //       }
// //     }).then((res) => {

// //       swal({
// //         text: res.data.title,
// //         icon: "success",
// //         type: "success"
// //       });

// //       this.setState({ page: 1 }, () => {
// //         this.pageChange(null, 1);
// //       });
// //     }).catch((err) => {
// //       swal({
// //         text: err.response.data.errorMessage,
// //         icon: "error",
// //         type: "error"
// //       });
// //     });
// //   }

// //   pageChange = (e, page) => {
// //     this.setState({ page: page }, () => {
// //       this.getProduct();
// //     });
// //   }

// //   logOut = () => {
// //     localStorage.setItem('token', null);
// //     // this.props.history.push('/');
// //     this.props.navigate("/");
// //   }

// //   onChange = (e) => {
// //     if (e.target.files && e.target.files[0] && e.target.files[0].name) {
// //       this.setState({ fileName: e.target.files[0].name }, () => { });
// //     }
// //     this.setState({ [e.target.name]: e.target.value }, () => { });
// //     if (e.target.name == 'search') {
// //       this.setState({ page: 1 }, () => {
// //         this.getProduct();
// //       });
// //     }
// //   };

// //   addProduct = () => {
// //     const file = new FormData();
// //     file.append('name', this.state.name);
// //     file.append('price', this.state.price);
// //    console.log(file);
// //     axios.post('http://localhost:2000/add-product', file, {
// //       headers: {
// //         'content-type': 'multipart/form-data',
// //         'token': this.state.token
// //       }
// //     }).then((res) => {

// //       swal({
// //         text: res.data.title,
// //         icon: "success",
// //         type: "success"
// //       });

// //       this.handleProductClose();
// //       this.setState({ name: '', desc: '', price: '', file: null, page: 1 }, () => {
// //         this.getProduct();
// //       });
// //     }).catch((err) => {
// //       swal({
// //         text: err.response.data.errorMessage,
// //         icon: "error",
// //         type: "error"
// //       });
// //       this.handleProductClose();
// //     });

// //   }

// //   updateProduct = () => {
// //     const fileInput = document.querySelector("#fileInput");
// //     const file = new FormData();
// //     file.append('id', this.state.id);
// //     file.append('file', fileInput.files[0]);
// //     file.append('name', this.state.name);
// //     file.append('desc', this.state.desc);
// //     file.append('discount', this.state.discount);
// //     file.append('price', this.state.price);

// //     axios.post('http://localhost:2000/update-product', file, {
// //       headers: {
// //         'content-type': 'multipart/form-data',
// //         'token': this.state.token
// //       }
// //     }).then((res) => {

// //       swal({
// //         text: res.data.title,
// //         icon: "success",
// //         type: "success"
// //       });

// //       this.handleProductEditClose();
// //       this.setState({ name: '', desc: '', discount: '', price: '', file: null }, () => {
// //         this.getProduct();
// //       });
// //     }).catch((err) => {
// //       swal({
// //         text: err.response.data.errorMessage,
// //         icon: "error",
// //         type: "error"
// //       });
// //       this.handleProductEditClose();
// //     });

// //   }

// //   handleProductOpen = () => {
// //     this.setState({
// //       openProductModal: true,
// //       id: '',
// //       name: '',
// //       desc: '',
// //       price: '',
// //       discount: '',
// //       fileName: ''
// //     });
// //   };

// //   handleProductClose = () => {
// //     this.setState({ openProductModal: false });
// //   };

// //   handleProductEditOpen = (data) => {
// //     this.setState({
// //       openProductEditModal: true,
// //       id: data._id,
// //       name: data.name,
// //       desc: data.desc,
// //       price: data.price,
// //       discount: data.discount,
// //       fileName: data.image
// //     });
// //   };

// //   handleProductEditClose = () => {
// //     this.setState({ openProductEditModal: false });
// //   };

// //   render() {
// //     return (
      
// //           <div   className='imp'>
// //             <h1>Price Tracker</h1>
// //             {/* <AddProduct  onAddProduct={this.addProduct}/> */}
         
// //             <input
// //               id="standard-basic"
// //               type="url"
// //               className='todo-input'
// //               autoComplete="off"
// //               name="name"
// //               value={this.state.name}
// //               onChange={this.onChange}
// //               placeholder="Product url"
// //               required
// //             />
         
// //             <input
// //               id="standard-basic"
// //               type="number"
// //               className='todo-input'
// //               autoComplete="off"
// //               name="price"
// //               value={this.state.price}
// //               onChange={this.onChange}
// //               placeholder="Price"
// //               required
// //             />
// //             <button
// //               className="todo-btn"
// //               onClick={(e) => this.addProduct()} color="primary" autoFocus>
// //               Add Product
// //             </button>
    
// //             <button
// //                   className="todo-btn"
// //                   variant="contained"
// //                   size="small"
// //                   onClick={this.logOut}
// //                 >
// //                   Log Out
// //                 </button>
// //             </div>
     
// //     );
// //   }
// // }

// // export default withRouter(Dashboard);
// import React, { Component } from 'react';
// import swal from 'sweetalert';
// import { withRouter } from './utils';
// import {
//   Button, TextField
// } from '@material-ui/core';
// const axios = require('axios');

// class Dashboard extends Component {
//   constructor() {
//     super();
//     this.state = {
//       token: '',
//       name: '',
//       price: '',
//       page: 1,
//       products: [],
//       pages: 0,
//     };
//   }

//   componentDidMount = () => {
//     let token = localStorage.getItem('token');
//     if (!token) {
//       this.props.navigate("/login");
//     } else {
//       this.setState({ token: token }, () => {
//         this.getProduct();
//       });
//     }
//   }

//   getProduct = () => {
//     this.setState({ loading: true });
//     let data = '?';
//     data = `${data}page=${this.state.page}`;
//     axios.get(`http://localhost:2000/get-product${data}`, {
//       headers: {
//         'token': this.state.token
//       }
//     }).then((res) => {
//       this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
//     }).catch((err) => {
//       swal({
//         text: err.response.data.errorMessage,
//         icon: "error",
//         type: "error"
//       });
//       this.setState({ loading: false, products: [], pages: 0 });
//     });
//   }

//   logOut = () => {
//     localStorage.setItem('token', null);
//     this.props.navigate("/");
//   }
//   onChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value }, () => { });

//   };
//   addProduct = () => {
//     const file = new FormData();
//     file.append('name', this.state.name);
//     file.append('price', this.state.price);
//     console.log(file);
//     axios.post('http://localhost:2000/add-product', file, {
//       headers: {
//         'content-type': 'multipart/form-data',
//         'token': this.state.token
//       }
//     }).then((res) => {
//       swal({
//         text: res.data.title,
//         icon: "success",
//         type: "success"
//       });
//       this.handleProductClose();
//       this.setState({ name: '', price: '', page: 1 }, () => {
//         this.getProduct();
//       });
//     }).catch((err) => {
//       swal({
//         text: err.response.data.errorMessage,
//         icon: "error",
//         type: "error"
//       });
//       this.handleProductClose();
//     });
//   }

//   // Other methods and render function remain unchanged

//   render() {
//     return (
//       <div className='imp'>
//         <h1>Price Tracker</h1>
//         <input
//           id="standard-basic"
//           type="url"
//           className='todo-input'
//           autoComplete="off"
//           name="name"
//           value={this.state.name}
//           onChange={this.onChange}
//           placeholder="Product url"
//           required
//         />
//         <input
//           id="standard-basic"
//           type="number"
//           className='todo-input'
//           autoComplete="off"
//           name="price"
//           value={this.state.price}
//           onChange={this.onChange}
//           placeholder="Price"
//           required
//         />
//         <button
//           className="todo-btn"
//           onClick={(e) => this.addProduct()} >
//           Add Product
//         </button>
//         <button
//           className="todo-btn"
//           variant="contained"
//           size="small"
//           onClick={this.logOut}
//         >
//           Log Out
//         </button>
//       </div>
//     );
//   }
// }

// export default withRouter(Dashboard);
// import React, { Component } from 'react';
// import {
//   Button, TextField, Dialog, DialogActions, LinearProgress,
//   DialogTitle, DialogContent, TableBody, Table,
//   TableContainer, TableHead, TableRow, TableCell
// } from '@material-ui/core';
// import { Pagination } from '@material-ui/lab';
// import swal from 'sweetalert';
// import { withRouter } from './utils';
// const axios = require('axios');

// class Dashboard extends Component {
//   constructor() {
//     super();
//     this.state = {
//       token: '',
//       openProductModal: false,
//       openProductEditModal: false,
//       id: '',
//       name: '',
//       desc: '',
//       price: '',
//       discount: '',
//       file: '',
//       fileName: '',
//       page: 1,
//       search: '',
//       products: [],
//       pages: 0,
//       loading: false
//     };
//   }

//   componentDidMount = () => {
//     let token = localStorage.getItem('token');
//     if (!token) {
//       // this.props.history.push('/login');
//       this.props.navigate("/login");
//     } else {
//       this.setState({ token: token }, () => {
//         this.getProduct();
//       });
//     }
//   }

//   getProduct = () => {
    
//     this.setState({ loading: true });

//     let data = '?';
//     data = `${data}page=${this.state.page}`;
//     if (this.state.search) {
//       data = `${data}&search=${this.state.search}`;
//     }
//     axios.get(`http://localhost:2000/get-product${data}`, {
//       headers: {
//         'token': this.state.token
//       }
//     }).then((res) => {
//       this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
//     }).catch((err) => {
//       swal({
//         text: err.response.data.errorMessage,
//         icon: "error",
//         type: "error"
//       });
//       this.setState({ loading: false, products: [], pages: 0 },()=>{});
//     });
//   }

//   deleteProduct = (id) => {
//     axios.post('http://localhost:2000/delete-product', {
//       id: id
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'token': this.state.token
//       }
//     }).then((res) => {

//       swal({
//         text: res.data.title,
//         icon: "success",
//         type: "success"
//       });

//       this.setState({ page: 1 }, () => {
//         this.pageChange(null, 1);
//       });
//     }).catch((err) => {
//       swal({
//         text: err.response.data.errorMessage,
//         icon: "error",
//         type: "error"
//       });
//     });
//   }

//   pageChange = (e, page) => {
//     this.setState({ page: page }, () => {
//       this.getProduct();
//     });
//   }

//   logOut = () => {
//     localStorage.setItem('token', null);
//     // this.props.history.push('/');
//     this.props.navigate("/");
//   }

//   onChange = (e) => {
//     if (e.target.files && e.target.files[0] && e.target.files[0].name) {
//       this.setState({ fileName: e.target.files[0].name }, () => { });
//     }
//     this.setState({ [e.target.name]: e.target.value }, () => { });
//     if (e.target.name == 'search') {
//       this.setState({ page: 1 }, () => {
//         this.getProduct();
//       });
//     }
//   };

//   addProduct = () => {
//     const fileInput = document.querySelector("#fileInput");
//     const file = new FormData();
//     file.append('file', fileInput.files[0]);
//     file.append('name', this.state.name);
//     file.append('desc', this.state.desc);
//     file.append('discount', this.state.discount);
//     file.append('price', this.state.price);
// console.log(file);
//     axios.post('http://localhost:2000/add-product',file, {
//       headers: {
//         'content-type': 'multipart/form-data',
//         'token': this.state.token
//       }
//     }).then((res) => {

//       swal({
//         text: res.data.title,
//         icon: "success",
//         type: "success"
//       });

//       this.handleProductClose();
//       this.setState({ name: '', desc: '', discount: '', price: '', file: null, page: 1 }, () => {
//         this.getProduct();
//       });
//     }).catch((err) => {
//       swal({
//         text: err.response.data.errorMessage,
//         icon: "error",
//         type: "error"
//       });
//       this.handleProductClose();
//     });

//   }

//   updateProduct = () => {
//     const fileInput = document.querySelector("#fileInput");
//     const file = new FormData();
//     file.append('id', this.state.id);
//     file.append('file', fileInput.files[0]);
//     file.append('name', this.state.name);
//     file.append('desc', this.state.desc);
//     file.append('discount', this.state.discount);
//     file.append('price', this.state.price);

//     axios.post('http://localhost:2000/update-product', file, {
//       headers: {
//         'content-type': 'multipart/form-data',
//         'token': this.state.token
//       }
//     }).then((res) => {

//       swal({
//         text: res.data.title,
//         icon: "success",
//         type: "success"
//       });

//       this.handleProductEditClose();
//       this.setState({ name: '', desc: '', discount: '', price: '', file: null }, () => {
//         this.getProduct();
//       });
//     }).catch((err) => {
//       swal({
//         text: err.response.data.errorMessage,
//         icon: "error",
//         type: "error"
//       });
//       this.handleProductEditClose();
//     });

//   }

//   handleProductOpen = () => {
//     this.setState({
//       openProductModal: true,
//       id: '',
//       name: '',
//       desc: '',
//       price: '',
//       discount: '',
//       fileName: ''
//     });
//   };

//   handleProductClose = () => {
//     this.setState({ openProductModal: false });
//   };

//   handleProductEditOpen = (data) => {
//     this.setState({
//       openProductEditModal: true,
//       id: data._id,
//       name: data.name,
//       desc: data.desc,
//       price: data.price,
//       discount: data.discount,
//       fileName: data.image
//     });
//   };

//   handleProductEditClose = () => {
//     this.setState({ openProductEditModal: false });
//   };

//   render() {
//     return (
//       <div>
//         {this.state.loading && <LinearProgress size={40} />}
//         <div>
//           <h2>Dashboard</h2>
//           <Button
//             className="button_style"
//             variant="contained"
//             color="primary"
//             size="small"
//             onClick={this.handleProductOpen}
//           >
//             Add Product
//           </Button>
//           <Button
//             className="button_style"
//             variant="contained"
//             size="small"
//             onClick={this.logOut}
//           >
//             Log Out
//           </Button>
//         </div>

//         {/* Edit Product */}
//         <Dialog
//           open={this.state.openProductEditModal}
//           onClose={this.handleProductClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">Edit Product</DialogTitle>
//           <DialogContent>
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="name"
//               value={this.state.name}
//               onChange={this.onChange}
//               placeholder="Product Name"
//               required
//             /><br />
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="desc"
//               value={this.state.desc}
//               onChange={this.onChange}
//               placeholder="Description"
//               required
//             /><br />
//             <TextField
//               id="standard-basic"
//               type="number"
//               autoComplete="off"
//               name="price"
//               value={this.state.price}
//               onChange={this.onChange}
//               placeholder="Price"
//               required
//             /><br />
//             <TextField
//               id="standard-basic"
//               type="number"
//               autoComplete="off"
//               name="discount"
//               value={this.state.discount}
//               onChange={this.onChange}
//               placeholder="Discount"
//               required
//             /><br /><br />
//             <Button
//               variant="contained"
//               component="label"
//             > Upload
//             <input
//                 type="file"
//                 accept="image/*"
//                 name="file"
//                 value={this.state.file}
//                 onChange={this.onChange}
//                 id="fileInput"
//                 placeholder="File"
//                 hidden
//               />
//             </Button>&nbsp;
//             {this.state.fileName}
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={this.handleProductEditClose} color="primary">
//               Cancel
//             </Button>
//             <Button
//               disabled={this.state.name == '' || this.state.desc == '' || this.state.discount == '' || this.state.price == ''}
//               onClick={(e) => this.updateProduct()} color="primary" autoFocus>
//               Edit Product
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Add Product */}
//         <Dialog
//           open={this.state.openProductModal}
//           onClose={this.handleProductClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">Add Product</DialogTitle>
//           <DialogContent>
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="name"
//               value={this.state.name}
//               onChange={this.onChange}
//               placeholder="Product Name"
//               required
//             /><br />
//             <TextField
//               id="standard-basic"
//               type="text"
//               autoComplete="off"
//               name="desc"
//               value={this.state.desc}
//               onChange={this.onChange}
//               placeholder="Description"
//               required
//             /><br />
//             <TextField
//               id="standard-basic"
//               type="number"
//               autoComplete="off"
//               name="price"
//               value={this.state.price}
//               onChange={this.onChange}
//               placeholder="Price"
//               required
//             /><br />
//             <TextField
//               id="standard-basic"
//               type="number"
//               autoComplete="off"
//               name="discount"
//               value={this.state.discount}
//               onChange={this.onChange}
//               placeholder="Discount"
//               required
//             /><br /><br />
//             <Button
//               variant="contained"
//               component="label"
//             > Upload
//             <input
//                 type="file"
//                 accept="image/*"
//                 name="file"
//                 value={this.state.file}
//                 onChange={this.onChange}
//                 id="fileInput"
//                 placeholder="File"
//                 hidden
//                 required
//               />
//             </Button>&nbsp;
//             {this.state.fileName}
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={this.handleProductClose} color="primary">
//               Cancel
//             </Button>
//             <Button
//               disabled={this.state.name == '' || this.state.desc == '' || this.state.discount == '' || this.state.price == '' || this.state.file == null}
//               onClick={(e) => this.addProduct()} color="primary" autoFocus>
//               Add Product
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <br />

//         <TableContainer>
//           <TextField
//             id="standard-basic"
//             type="search"
//             autoComplete="off"
//             name="search"
//             value={this.state.search}
//             onChange={this.onChange}
//             placeholder="Search by product name"
//             required
//           />
//           <Table aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center">Name</TableCell>
//                 <TableCell align="center">Image</TableCell>
//                 <TableCell align="center">Description</TableCell>
//                 <TableCell align="center">Price</TableCell>
//                 <TableCell align="center">Discount</TableCell>
//                 <TableCell align="center">Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {this.state.products.map((row) => (
//                 <TableRow key={row.name}>
//                   <TableCell align="center" component="th" scope="row">
//                     {row.name}
//                   </TableCell>
//                   <TableCell align="center"><img src={`http://localhost:2000/${row.image}`} width="70" height="70" /></TableCell>
//                   <TableCell align="center">{row.desc}</TableCell>
//                   <TableCell align="center">{row.price}</TableCell>
//                   <TableCell align="center">{row.discount}</TableCell>
//                   <TableCell align="center">
//                     <Button
//                       className="button_style"
//                       variant="outlined"
//                       color="primary"
//                       size="small"
//                       onClick={(e) => this.handleProductEditOpen(row)}
//                     >
//                       Edit
//                   </Button>
//                     <Button
//                       className="button_style"
//                       variant="outlined"
//                       color="secondary"
//                       size="small"
//                       onClick={(e) => this.deleteProduct(row._id)}
//                     >
//                       Delete
//                   </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <br />
//           <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
//         </TableContainer>

//       </div>
//     );
//   }
// }

// export default withRouter(Dashboard);
import React, { Component } from 'react';
import './Dashboard.css'
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import { withRouter } from './utils';

const axios = require('axios');
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      products: [],
   
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      // this.props.history.push('/login');
      this.props.navigate("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getProduct();
      });
    }
  }

  getProduct = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get-product${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, products: [], pages: 0 },()=>{});
    });
  }

  deleteProduct = (id) => {
    axios.post('http://localhost:2000/delete-product', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getProduct();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    // this.props.history.push('/');
    this.props.navigate("/");
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getProduct();
      });
    }
  };

  addProduct = () => {
    const data = {
      name: this.state.name,
      price: this.state.price,
      // Add more key-value pairs as needed
    };

    console.log(data);
    axios.post('http://localhost:2000/add-product', data , {
      headers: {
        'content-type': 'application/json',
        'token': this.state.token
      }

    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProductClose();
      this.setState({ name: '', desc: '', discount: '', price: '', po:[],file: null, page: 1 }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductClose();
    });

  }

  updateProduct = () => {
    // const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    // file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    // file.append('desc', this.state.desc);
    // file.append('discount', this.state.discount);
    file.append('price', this.state.price);

    axios.post('http://localhost:2000/update-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProductEditClose();
      this.setState({ name: '', desc: '', discount: '', price: '', file: null }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductEditClose();
    });

  }

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      fileName: ''
    });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  handleProductEditOpen = (data) => {
    this.setState({
      openProductEditModal: true,
      id: data._id,
      name: data.name,
      desc: data.desc,
      price: data.price,
      discount: data.discount,
      fileName: data.image
    });
  };

  handleProductEditClose = () => {
    this.setState({ openProductEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
        <div className='top-nav'>
        
        <div className='left-div'>
        <button
            className="todo-btn add"
            variant="contained"
            size="small"
            onClick={this.handleProductOpen}
          >
            Add Product
          </button>
          <button
            className="todo-btn log-out"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </button>
        </div>
        
        </div>
         
       
        </div>

        {/* Add Product */}
        <Dialog
          open={this.state.openProductModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <input
              id="standard-basic"
              type="url"
              autoComplete="off"
              name="name"
              className='todo-input'
              value={this.state.name}
              onChange={this.onChange}
              placeholder="ENTER URL"
              required
            /><br />
            <input
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              className='todo-input'
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Desired Price"
              required
            /><br />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose} color="dark">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == ''  || this.state.price == '' }
              className='todo-btn'
              onClick={(e) => this.addProduct()} color="dark" autoFocus>
              
              Add Product
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <div className="product-list">
            <header className="container">
            <h1>Shopping Cart</h1>
            
           <ul className="breadcrumb">
        <li>Your Items</li>
      </ul>

      <span className="count"> </span>
    </header>
            
              {this.state.products.map((data) => (
                
          <section className='container'>
          <ul className="products">
          <li  className="row" key={data.name}>
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
              <button
                      className="todo-btn"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteProduct(data._id)}
                    >
                      Delete
                  </button>
              </div>
             
          </li>
          </ul>
          </section>

              ))}
        
          <br />
        </div>

      </div>
    );
  }
}

export default withRouter(Dashboard);
