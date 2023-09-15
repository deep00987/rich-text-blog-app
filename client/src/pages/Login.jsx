import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import blogLogo from '../img/logo4.png'
import { ToastContainer, Slide, toast } from "react-toastify";


const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);


  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // console.log(inputs)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = "submit login info"
    setLoading(true)

    // toast.warning("loggin in ..", {
    //   hideProgressBar: true,
    //   closeOnClick: true,
    //   toastId,
    //   transition:Slide
    // })

    try {
      await login(inputs)

      toast.success("success", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });

      navigate("/");
    } catch (err) {
      setError(err.response.data.errors);
      toast.warning(err?.response?.data?.errors[0]?.message || "something went wrong", 
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });
    }finally{
      setLoading(false)
    }
  };
  return (
    <div className="auth__login">
      <div className="auth__login__wrapper__container">
        <img src={blogLogo} alt="" />
        <div className="auth__login__wrapper">
          <h1 className="login__header">Login</h1>
          <form encType="multipart/form-data" method="POST" className="login__form">
            <label htmlFor="email" className="auth__login__labels"> Enter email adderss</label>
            <input
              required
              type="text"
              placeholder="email"
              name="email"
              id="email"
              onChange={handleChange}
            />
            <label htmlFor="password" className="auth__login__labels"> Enter password</label>

            <input
              required
              type="password"
              placeholder="password"
              name="password"
              id="password"
              onChange={handleChange}
            />
            <button onClick={handleSubmit} >Login</button>
            {/* {err && <p>{err[0]?.message}</p>} */}
            <span className="auth__login__footer">
              Don't have an account? <Link to="/register">Register</Link>
            </span>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right"/>
    </div>
  );
};

export default Login;
