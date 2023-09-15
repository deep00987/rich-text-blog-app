import React from "react";
import "./Modal.css";
import {MdClose} from 'react-icons/md'
import unauthorizedImg from '../../img/unauthorizedImg.png'
import { useNavigate } from "react-router-dom";

function Modal({ setOpenModal }) {
  const navigator = useNavigate()
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
        <h3>Login to Continue</h3>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <MdClose size={26} style={{marginBottom: -3}}/>
          </button>
        </div>
        
        <div className="title">
          <img src={unauthorizedImg} alt="" />
          <p>To perform this action, you need to be logged in, click in the link below to login.</p>
        </div>
        <div className="footer">
          {/* <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button> */}
          <button className="modal__login__btn" onClick={()=>{navigator('/login')}}>Log in</button>
          <p className="footer_txt">Dont have an account ? <a href="/register">sign in</a></p>
          
        
        </div>
      </div>
    </div>
  );
}

export default Modal;