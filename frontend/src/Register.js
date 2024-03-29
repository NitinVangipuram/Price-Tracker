import React, { Component } from "react";
import swal from "sweetalert";
import { Button, TextField, Link } from "@material-ui/core";
import { withRouter } from "./utils";
import './Login.css'
import GoogleLoginButton from "./GoogleLoginButton";
import { GoogleOAuthProvider } from '@react-oauth/google';

import axios from "axios";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
class Register extends React.Component {
  componentDidMount() {
    document.body.classList.add('main-page');
  }

  componentWillUnmount() {
    document.body.classList.remove('main-page');
  }
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {

    axios.post(`${API_ENDPOINT}register`, {
      username: this.state.username,
      password: this.state.password,
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      // this.props.history.push('/');
      this.props.navigate("/");
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  render() {
    return (
      <div className="login-container">
<div className="login-form">
      <div className="login-form-inner">
        <div className="logo">
          {/* Include SVG or Logo component here */}
          
        </div>
        <h1>Register</h1>
        <p className="body-text">Track Your Prices and get Notified !</p>

        <GoogleOAuthProvider clientId="878605208401-tvg8asmdh98jeukpnbhfd355v6p93dl6.apps.googleusercontent.com">
          <GoogleLoginButton history={this.props.history} />
        </GoogleOAuthProvider>

        {/* <div className="sign-in-separator">
        <span>or Sign in with Email</span>
      </div> */}
      <div className="credential-login">
      <div className="login-form-group">
        <label htmlFor="email">Email <span className="required-star">*</span></label>
        <input
            id="standard-basic"
            className="todo-input"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="User Name"
            required
          />
      </div>
      <div className="login-form-group">
        <label htmlFor="pwd">Password <span className="required-star">*</span></label>
            <input
            id="standard-basic"
            className="todo-input"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
         
      </div>
      <div className="login-form-group">
        <label htmlFor="pwd">Confirm Password <span className="required-star">*</span></label>
             <input
            id="standard-basic"
            className="todo-input"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={this.state.confirm_password}
            onChange={this.onChange}
            placeholder="Confirm Password"
            required
          />
         
      </div>
    

         
                     <button
            className="rounded-button login-cta"
            variant="contained"
            // color="primary"
            size="small"
            disabled={this.state.username == '' && this.state.password == ''}
            style={{cursor:"pointer"}}
            onClick={this.register}
          >
            Register
          </button> 

      <div className="register-div">Already have an account?   
      <Link
            // href="/"
            component="button"
           
            style={{ fontFamily: "inherit", fontSize: "inherit" ,color:"#FF4742"}}
            onClick={() => {
              this.props.navigate("/");
            }}
          >
            Login</Link></div>
         
    </div>
    </div>
 
      </div>
</div>
    );
  }
}

export default withRouter(Register);
