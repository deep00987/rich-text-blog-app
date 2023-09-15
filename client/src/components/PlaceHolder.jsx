import React from 'react'
import { useNavigate } from 'react-router-dom';
import noContent from '../img/noContent.png'

import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import Modal from './Modal/Modal';

const PlaceHolder = () => {

    const {currentUser} = useContext(AuthContext)
    const navigator = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)

    const handleBtnClick = (e) => {
      console.log(e.currentTarget)

      if (!currentUser){
        setModalOpen(true)
        return
      }

      navigator('/write')
    }


    return (
      <>
        <div className="placeholder">
          <div className="placeholder__title">
            <h3>No blogs found 😓</h3> 
          </div>
          <div className="placeholder__description">
              <p>
              Sorry, there are no blogs available of this category  at the moment. <br></br>
              To create a new new blog click in the link below
              </p>
          </div>
          <img src={noContent} alt="" />
          <button className="placeholder__create-link" onClick={handleBtnClick}>
            Create Post
          </button>
        </div>
        {modalOpen && <Modal setOpenModal={setModalOpen} />}
      </>
    );
};


export default PlaceHolder