import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import {
  Button, Dialog, DialogActions, LinearProgress,
  DialogContent
} from '@material-ui/core';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of withRouter
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const Dashboard = () => {
  const [token, setToken] = useState('');
  const [openProductModal, setOpenProductModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    } else {
      setToken(token);
      getProduct(token);
    }
  }, [navigate]);

  const getProduct = (token) => {
    setLoading(true);
    axios.get(`${API_ENDPOINT}get-product`, {
      headers: { token }
    }).then((res) => {
      setLoading(false);
      setProducts(res.data.products);
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      setLoading(false);
      setProducts([]);
    });
  };

  const deleteProduct = (id) => {
    axios.post(`${API_ENDPOINT}delete-product`, { id }, {
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      getProduct(token);
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  };

  const logOut = () => {
    localStorage.setItem('token', null);
    navigate("/");
  };

  const onChangeName = (e) => setName(e.target.value);
  const onChangePrice = (e) => setPrice(e.target.value);

  const addProduct = () => {
    const data = { name, price };

    axios.post(`${API_ENDPOINT}add-product`, data, {
      headers: {
        'content-type': 'application/json',
        'token': token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      handleProductClose();
      setName('');
      setPrice('');
      getProduct(token);
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      handleProductClose();
    });
  };

  const handleProductOpen = () => setOpenProductModal(true);
  const handleProductClose = () => setOpenProductModal(false);

  return (
    <div>
      {loading && <LinearProgress size={40} />}
      <div>
        <div className='top-nav'>
          <div className='left-div'>
            <button
              className="button-40 add"
              variant="contained"
              size="small"
              onClick={handleProductOpen}
            >
              Add Product
            </button>
            <button
              className="button-40 log-out"
              variant="contained"
              size="small"
              onClick={logOut}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Add Product */}
      <Dialog
        open={openProductModal}
        onClose={handleProductClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className='popup'>
          <DialogContent>
            <input
              id="standard-basic"
              type="url"
              autoComplete="off"
              name="name"
              className='todo-input pop'
              value={name}
              onChange={onChangeName}
              placeholder="ENTER URL"
              required
            /><br />
            <input
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              className='todo-input pop'
              value={price}
              onChange={onChangePrice}
              placeholder="Desired Price"
              required
            /><br />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleProductClose} color="dark">
              Cancel
            </Button>
            <Button
              disabled={name === '' || price === ''}
              className='todo-btn'
              onClick={addProduct}
            >
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
          <span className="count"></span>
        </header>

        {products.map((data) => (
          <section className='container' key={data._id}>
            <ul className="products">
              <li className="row">
                <div className="col left">
                  <div className="thumbnail">
                    <a href={data.productUrl} target="_blank" rel="noopener noreferrer">
                      <img src={data.image} alt={data.name} />
                    </a>
                  </div>
                  <div className="detail">
                    <div className="name">
                      <a href={data.productUrl} target="_blank" rel="noopener noreferrer">{data.name.slice(0, 15)}</a>
                    </div>
                    <div className="description">{data.name}</div>
                    <div className="price"><span className='pr'> Price : </span><span>&#8377;</span>{data.price}</div>
                  </div>
                </div>
                <div className="col right">
                  <button
                    className="button-24"
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => deleteProduct(data._id)}
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
};

export default Dashboard;
