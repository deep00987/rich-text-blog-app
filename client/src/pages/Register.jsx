import React, { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { ToastContainer, Slide, toast } from "react-toastify";

import axios from "axios";
import blogLogo from '../img/logo4.png'
const Register = () => {

  const [inputs, setInputs] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [err, setError] = useState(null);
  const [file, setFile] = useState(null)
  const { register } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // console.log(inputs)
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0])
    setFile(e.target.files[0])
  } 

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    const toastId = "register user"
    
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    var data = new FormData(document.getElementById('user__reg__form'));

    // for (var pair of data.entries()) {
    //   console.log(pair[0]+ ' - ' + pair[1]); 
    // }

    try {
      const response = await axios.post("/auth/register", data, config);
      // console.log(response?.data)
      register(response?.data?.data?.user)

      toast.success("success", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });

      navigate("/");
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.errors);
      toast.warning(err?.response?.data?.errors[0]?.message || "something went wrong", 
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });
    }
  };

  return (
    <div className="auth__login">
      <div className="auth__login__wrapper__container">
        <img src={blogLogo} alt="" />
        <div className="auth__login__wrapper">
          <h1 className="login__header">Register</h1>
          <form id="user__reg__form"encType="multipart/form-data" method="POST" className="login__form"
            style={{
              minWidth: 350,
            }}
          >
            <label htmlFor="fullname" className="auth__login__labels">Enter full name</label>
            <input
              required
              type="text"
              placeholder="fullname"
              name="fullname"
              id="fullname"
              onChange={handleChange}

            />
            <label htmlFor="username" className="auth__login__labels">Enter username</label>
            <input
              required
              type="text"
              placeholder="username"
              name="username"
              id="username"
              onChange={handleChange}
            />

            <label htmlFor="email" className="auth__login__labels">Enter email address</label>

            <input
              required
              type="email"
              placeholder="email"
              name="email"
              id="email"
              onChange={handleChange}
            />
            <label htmlFor="password" className="auth__login__labels">Enter password</label>

            <input
              required
              type="password"
              placeholder="password"
              name="password"
              id="password"
              onChange={handleChange}
            />
            <label htmlFor="email" className="auth__login__labels">Select display picture</label>

            <input
              required
              type="file"
              placeholder="displayPicture"
              name="displayPicture"
              id="displayPicture"
              onChange={handleFileChange}
              // value={file}
            />

            <button onClick={handleSubmit} >Register</button>
            {/* {err && <p>{err[0]?.message}</p>} */}
            <span>
              Do you have an account? <Link to="/login">Login</Link>
            </span>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right"/>
    </div>
  );
};

export default Register;
