import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import swal from 'sweetalert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const bcrypt = require('bcryptjs');

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const GoogleLoginButton = () => {
  const navigate = useNavigate(); // Use the useNavigate hook here

  const navigateToDashboard = () => {
    console.log("Login Success");
    navigate('/dashboard');
  };

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const decodedData = jwtDecode(credentialResponse.credential);
        console.log(decodedData);

        axios
          .post(`${API_ENDPOINT}google-login`, {
            username: decodedData.email,
            verified: decodedData.email_verified,
          })
          .then((res) => {
            console.log(res);
            localStorage.setItem('token', res.data.token);
            navigateToDashboard();
          })
          .catch((err) => {
            if (err.response && err.response.data && err.response.data.errorMessage) {
              swal({
                text: err.response.data.errorMessage,
                icon: 'error',
                type: 'error',
              });
            }
          });
      }}
      onError={() => {
        console.log('Login Failed');
      }}
     
    />
  );
};

export default GoogleLoginButton;
