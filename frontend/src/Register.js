import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { Link } from "@material-ui/core";
import { useNavigate } from 'react-router-dom'; // For navigation
import './Login.css';
import GoogleLoginButton from "./GoogleLoginButton";
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Replaces this.props.navigate

  useEffect(() => {
    document.body.classList.add('main-page');
    return () => {
      document.body.classList.remove('main-page');
    };
  }, []);

  const register = () => {
    if (password !== confirmPassword) {
      swal({
        text: "Passwords do not match!",
        icon: "error",
        type: "error"
      });
      return;
    }

    axios.post(`${API_ENDPOINT}register`, {
      username,
      password,
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      navigate("/");
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-form-inner">
          <div className="logo">
            {/* Include SVG or Logo component here */}
          </div>
          <h1>Register</h1>
          <p className="body-text">Track Your Prices and get Notified!</p>

          <GoogleOAuthProvider clientId="878605208401-tvg8asmdh98jeukpnbhfd355v6p93dl6.apps.googleusercontent.com">
            <GoogleLoginButton />
          </GoogleOAuthProvider>

          <div className="credential-login">
            <div className="login-form-group">
              <label htmlFor="email">Email <span className="required-star">*</span></label>
              <input
                id="standard-basic"
                className="todo-input"
                type="text"
                autoComplete="off"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="confirm_pwd">Confirm Password <span className="required-star">*</span></label>
              <input
                id="standard-basic"
                className="todo-input"
                type="password"
                autoComplete="off"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            </div>

            <button
              className="rounded-button login-cta"
              variant="contained"
              size="small"
              disabled={username === '' || password === ''}
              style={{ cursor: "pointer" }}
              onClick={register}
            >
              Register
            </button>

            <div className="register-div">
              Already have an account?{' '}
              <Link
                component="button"
                style={{ fontFamily: "inherit", fontSize: "inherit", color: "#FF4742" }}
                onClick={() => navigate("/")}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
