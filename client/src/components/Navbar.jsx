import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo1 from "../img/logo1.png";

import SearchBar from "./SearchBarComps/SearchBar";
import { SearchResultsList } from "./SearchBarComps/SearchResultsList";
import Dropdown from "./Dropdown/Dropdown";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import defaultUserImage from '../img/defaultUserImage.svg'
import successGreen2 from '../img/SuccessGreen2.svg'
import successYellow1 from '../img/successYellow1.svg'
import {HiOutlineViewGridAdd} from 'react-icons/hi'
import Modal from "../components/Modal/Modal"

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [results, setResults] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const searchResultRef = useRef()
  const navigator = useNavigate()


  const resetSearchResults = () => {
    setResults([])
  }
  const handleTest = (e) => {
    window.location = `${e.currentTarget?.href}` 
    // try {
    // } catch (error) {
    //   console.log(error)
    // }
    // console.log(e.currentTarget.href)
  }

  const handleWriteBtn = (e) => {
    console.log(e.currentTarget)
    if (currentUser) {
      navigator('/write')
    }else{
      console.log("l")
      setModalOpen(true)
    }
  }

  useEffect(()=>{
    
    const handleClickOutside = (event) => {
      if (searchResultRef.current && !searchResultRef.current.contains(event.target)) {
        console.log(event.target)
        resetSearchResults()
      }
    }

    window.addEventListener("click", handleClickOutside)
    return () => {
      window.removeEventListener("click", handleClickOutside)
    }

  }, [currentUser])

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/" onClick={handleTest}>
          <img src={Logo1} alt="" />
          </Link>
        </div>

        <div className="search__bar__container">
          <SearchBar setResults={setResults} />
          {results && results.length > 0 && (
            <div className="sad" ref={searchResultRef}>
              <SearchResultsList results={results}/>
            </div>
          )}
        </div>

        <div className="links">
          
          <Dropdown
            trigger={
            <button className="dropdown__btn">
              <div>
                Category &nbsp; 
              </div>
              <div style={{marginTop: 2}}><FontAwesomeIcon icon={faAngleDown}/></div>
            </button>
            }
            menu={[
              <Link className="link" to="/?category=art" onClick={handleTest} data_to="/?category=art">
                <h5>Art</h5>
              </Link>,
              <Link className="link" to="/?category=science" onClick={handleTest} data_to="/?category=science">
                <h5>Science</h5>
              </Link>,
              <Link className="link" to="/?category=technology" data_to="/?category=technology" onClick={handleTest}>
                <h5>Tech</h5>
              </Link>,
              <Link className="link" to="/?category=cinema" data_to="/?category=cinema" onClick={handleTest}>
                <h5>Cinema</h5>
              </Link>,
              <Link className="link" to="/?category=design" data_to="/?category=design" onClick={handleTest}>
                <h5>Design</h5>
              </Link>,
              <Link className="link" to="/?category=food" data_to="/?category=food" onClick={handleTest}>
                <h5>Food</h5>
              </Link>
            ]}
            data_header = "Filter by category"
          />

          <button className="write" onClick={handleWriteBtn}>
            <div className="link" 
              style={{
                display:"flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap:5
              }}
            >
              <HiOutlineViewGridAdd style = {{marginTop: 0, color: "#555"}} size={20} className="post__icon" />
              <h5>Add post </h5>
            </div>
          </button>

          <Dropdown 
            trigger = {
              <div className="dropdown__btn__profile">
                
                <div className="user__meta">
                  <div className="user__meta__left">
                    <div className="user__meta__name">
                      {
                        currentUser ? (<p>{currentUser?.username}</p>) : (<p>guest_user</p>)
                      }
                    </div>
                    <div className="user__status__info">
                      <img src={currentUser ? successGreen2 : successYellow1} alt="" />
                      {
                        currentUser ? (<p>logged in</p>) : (<p>logged out</p>)
                      }
                    </div>
                  </div>
                  <div className="user__meta__right">
                    <div style={{marginTop: 2}}><FontAwesomeIcon icon={faAngleDown}/></div>
                  </div>
                </div>

                <div className="user__profile__img__box">
                  {currentUser ? 
                    <img src={`${process.env.REACT_APP_STATIC_URI}${currentUser?.displayPicture}`} alt="" />
                  : 
                    <img src={defaultUserImage} alt="" />                   
                  }
                </div>

              </div>
            }

            menu={currentUser ? [
              <Link className="link" to="/profile">
                <h5>
                  Profile
                </h5>
              </Link>,
              <span onClick={logout} className="link"><h5>Logout</h5></span>,
              ,
            ] : [
              <Link className="link" to="/login">
                <h5>
                  Login
                </h5>
              </Link>,
              <Link className="link" to="/register">
              <h5>
                Register
              </h5>
            </Link>,
            ]}
            data_header = "User info"
          />      
        </div>
      </div>
      {modalOpen && <Modal setOpenModal={setModalOpen}/>}
    </div>
  );
};

export default Navbar;
