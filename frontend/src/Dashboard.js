
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
import axios from 'axios';

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
            className="button-40 add"
            variant="contained"
            size="small"
            onClick={this.handleProductOpen}
          >
            Add Product
          </button>
          <button
            className="button-40 log-out"
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
        <div className='popup'>
          <DialogContent >
            <input
              id="standard-basic"
              type="url"
              autoComplete="off"
              name="name"
              className='todo-input pop'
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
              className='todo-input pop'
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
              onClick={(e) => this.addProduct()}  >
              
              Add Product
            </Button>
          </DialogActions>
          </div>
        </Dialog>

        <br />

        <div className="product-list">
            <header className="container">
            <h1>Your Cart</h1>
            
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
                  <div className="price"> <span className='pr'> Price : </span><span>&#8377;</span>{data.price}</div>
                </div>
              </div>
              <div className="col right">
              <button
                      className="button-24"
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
