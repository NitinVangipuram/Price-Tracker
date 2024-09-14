import React, { useState ,useEffect} from "react";
import swal from "sweetalert";
import {  Link } from "@material-ui/core";
import { useNavigate } from "react-router-dom"; 
import GoogleLoginButton from "./GoogleLoginButton";
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const login = () => {
    const pwd = bcrypt.hashSync(password, salt);
    axios.post(`${API_ENDPOINT}login`, {
      username: username,
      password: pwd,
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);
      navigate("/dashboard");
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
    });
  };

  useEffect(() => {
    document.body.classList.add('main-page');
    return () => {
      document.body.classList.remove('main-page');
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-form-inner">
          <h1>Login</h1>
          <p className="body-text">Track Your Prices and get Notified!</p>
          
          <GoogleOAuthProvider
            className="google-login"
            clientId="878605208401-tvg8asmdh98jeukpnbhfd355v6p93dl6.apps.googleusercontent.com"
          >
            <GoogleLoginButton />
          </GoogleOAuthProvider>

          <div className="credential-login">
            <div className="login-form-group">
              <label htmlFor="email">Email <span className="required-star">*</span></label>
              <input
                id="standard-basic"
                type="text"
                className="todo-input"
                autoComplete="off"
                name="username"
                value={username}
                onChange={onChangeUsername}
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
                value={password}
                onChange={onChangePassword}
                placeholder="Password"
                required
              />
            </div>

            <button
              variant="contained"
              className="rounded-button login-cta"
              size="small"
              disabled={username === '' || password === ''}
              style={{ cursor: "pointer" }}
              onClick={login}
            >
              Login
            </button>

            <div className="register-div">
              Not registered yet?  
              <Link
                component="button"
                style={{ fontFamily: "inherit", fontSize: "inherit", color: "#FF4742" }}
                onClick={() => navigate("/register")}
              >
                Create an account?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
