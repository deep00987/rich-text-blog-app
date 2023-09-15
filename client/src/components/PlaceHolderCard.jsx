import React, {useState, useContext} from 'react'
import not_found_location from '../img/location-not-found.svg'
import noContent from '../img/noContent.png'
import { Link } from 'react-router-dom';
import Modal from '../components/Modal/Modal'
import {AuthContext} from '../context/authContext'
import { useNavigate } from 'react-router-dom';

const PlaceHolderCard = ({category}) => {
    console.log("cate:", category)
    const [modalOpen, setModalOpen] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleButtonClick = (e) => {
        if(!currentUser) {
            setModalOpen(true)
        }else{
            navigate('/write')
        }
    }

    return (
        <>
            <div className="placeholder__card">
                <div className="placeholder__card__title">
                    <h3>No blogs found 😓</h3>
                </div>
                <div className="placeholder__card__description">
                    <p>
                        Sorry, no other blog of {category || "similar"} categroy is found.
                        To create a new new blog click in the link below
                    </p>
                </div>
                <img src={noContent} alt="" />
                <button className="placeholder__card__create-link" 
                    style = {{border: "none", minWidth: 102, cursor: "pointer"}}
                    onClick={handleButtonClick}
                >
                    Create Post
                </button>
            </div>
            {modalOpen && <Modal setOpenModal={setModalOpen} />}
        </>
    );
}

export default PlaceHolderCard