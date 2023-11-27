import React, { Component } from "react";
import swal from "sweetalert";
import { Button, TextField, Link } from "@material-ui/core";
import { withRouter } from "./utils";
import GoogleLoginButton from "./GoogleLoginButton";
import axios from "axios";
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
class Login extends React.Component {
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
      password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {
    const pwd = bcrypt.hashSync(this.state.password, salt);

    axios.post(`${API_ENDPOINT}login`, {
      username: this.state.username,
      password: pwd,
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);
      // this.props.history.push('/dashboard');
      this.props.navigate("/dashboard");
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
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
        <h1>Login</h1>
        <p className="body-text">Track Your Prices and get Notified!</p>

        <GoogleLoginButton />

        {/* <div className="sign-in-separator">
        <span>or Sign in with Email</span>
      </div> */}

      <div className="login-form-group">
        <label htmlFor="email">Email <span className="required-star">*</span></label>
        <input
             id="standard-basic"
            type="text"
            className="todo-input"
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
            type="password"
            className="todo-input"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
      </div>

      <div className="login-form-group single-row">
       

      
      </div>

         <button
            
                  variant="contained"
                 className="rounded-button login-cta"
                  size="small"
                  disabled={this.state.username == '' && this.state.password == ''}
                  onClick={this.login}
                >
                  Login
                </button> 

      <div className="register-div">Not registered yet?   <Link
            // href="/register"
            component="button"
            style={{ fontFamily: "inherit", fontSize: "inherit",color:"#FF4742" }}
            onClick={() => {
              this.props.navigate("/register");
            }}
          >
           
          Create an account?</Link></div>
         
    </div>
    </div>
 
      </div>
    
    );
  }
}

export default withRouter(Login);