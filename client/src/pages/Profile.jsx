import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [curUser, setCurrUser] = useState(null);

  useEffect(() => {
    setCurrUser(currentUser);
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    curUser ? (<UserProfile/>) : null
  );
};

export default Profile;