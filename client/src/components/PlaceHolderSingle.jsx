import React from 'react'
import { useNavigate } from 'react-router-dom';
import noContent from '../img/noContent.png'

import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import Modal from './Modal/Modal';


const PlaceHolderSingle = () => {
  const { currentUser } = useContext(AuthContext)
  const navigator = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const handleBtnClick = (e) => {
    console.log(e.currentTarget)

    if (!currentUser) {
      setModalOpen(true)
      return
    }

    navigator('/write')
  }


  return (
    <>
      <div className="placeholder__single">
        <div className="placeholder__single__title">
          <h3>404<span>&#124;</span>Blog page doesn't exist 😓</h3>
        </div>
        <div className="placeholder__single__description">
          <p>
            Sorry, the blog page that you are trying to access, is not available at the moment or doesnt exist. <br></br>
            To create a new new blog click in the link below
          </p>
        </div>
        <img src={noContent} alt="" />
        <button className="placeholder__single__create-link" onClick={handleBtnClick}>
          Create Post
        </button>
      </div>
      {modalOpen && <Modal setOpenModal={setModalOpen} />}
    </>
  );
}

export default PlaceHolderSingle