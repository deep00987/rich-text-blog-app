import React, { useState, useEffect, useContext } from 'react';
import './UserProfile.scss'; // Make sure to create this CSS file for styling
import { FiEdit3 } from 'react-icons/fi'
import { AiOutlinePicture } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import {GrAdd} from 'react-icons/gr'
import { Link } from 'react-router-dom';
import UserInfoForm from './UserInfoForm';
import UserUpdateForm from './UserUpdateForm';
import UserPasswdForm from './UserPasswdForm';
import UserDpForm from './UserDpForm';
import { AuthContext } from '../context/authContext'
import ProfileLoader from './Loaders/ProfileLoader';

const UserProfile = () => {
	const [userData, setUserData] = useState(null);
	const [info1, setInfo1] = useState(true)
	const [info2, setInfo2] = useState(false)
	const [info3, setInfo3] = useState(false)
	const [info4, setInfo4] = useState(false)
	const {currentUser} = useContext(AuthContext)
	const [isLoading , setIsLoading ]= useState(true)

	useEffect(() => {
		
		setUserData({...userData, ...currentUser});
		setIsLoading(false)

	}, [currentUser]);

	// // Function to handle user info update (you can customize this as needed)
	// const handleUpdateInfo = () => {
	// 	// Add your logic to update user info here
	// 	console.log('User info updated!');
	// };

	const handleMenuBtnClick = (e) => {
		e.preventDefault()
		console.log(e.currentTarget)
		const id = e.currentTarget.id

		switch (id) {
			case "info1":
				setInfo1(true)
				setInfo2(false)
				setInfo3(false)
				setInfo4(false)
				break;
			case "info2":
				setInfo1(false)
				setInfo2(true)
				setInfo3(false)
				setInfo4(false)
				break;
			case "info3":
				setInfo1(false)
				setInfo2(false)
				setInfo3(true)
				setInfo4(false)
				break;
			case "info4":
				setInfo1(false)
				setInfo2(false)
				setInfo3(false)
				setInfo4(true)
				break;
			default:
				break;
		}

		console.log(info1, info2, info3, info4)

	}

	return (
		<div className='user__container'>
			{userData && !isLoading ? (
				<>
					<div className="user__profile__container">
						<div className="user__profile__left__container">
							<div className="user__profile__left">
								<div className="user__display__img">
									<img src={`${process.env.REACT_APP_STATIC_URI}${userData.displayPicture}`} alt='User Profile' />
									<div className="user__dp__change__form">
										<button className='dp__change__btn'id="info4" onClick={handleMenuBtnClick}><GrAdd size = {16} style = {{marginTop: 3.77}}/></button>
									</div>
								</div>
								<div className="user__info__meta">
									<h4>{userData?.fullname || `Default user`}</h4>
									<p>{userData?.email || "example@example.com"}</p>
								</div>
							</div>

							<div className="user__profile__links">
									<button className='user__link__btn' id="info1" onClick={handleMenuBtnClick}><FiEdit3 size = {16} style = {{marginTop: 2}}/> &nbsp; User information </button>
									<button className='user__link__btn'id="info2" onClick={handleMenuBtnClick}><AiOutlinePicture size = {16} style = {{marginTop: 2}}/> &nbsp;Update profile</button>
									<button className='user__link__btn'id="info3" onClick={handleMenuBtnClick}><RiLockPasswordLine size = {16} style = {{marginTop: 2}}/> &nbsp;Password   </button>
									<button className='user__link__btn'id="info4" onClick={handleMenuBtnClick}><AiOutlinePicture size = {16} style = {{marginTop: 2}}/> &nbsp;Profile picture</button>
							</div>

						</div>
						

						<div className='user__profile__right'>
							<div className="user__info__details">
								{/* <UserInfoForm data = {userData}/> */}
								{
									info1 && <UserInfoForm data = {userData} handleClick = {handleMenuBtnClick} id = "info2"/>
								}
								{
									info2 && <UserUpdateForm data = {userData}/>
								}
								{
									info3 && <UserPasswdForm data = {userData}/>
								}
								{
									info4 && <UserDpForm data = {userData}/>
								}
							</div>
							{/* <div>
								<p>Full Name: {userData.fullname}</p>
								<p>Email: {userData.email}</p>
							</div> */}
						</div>

					</div>
					
					
					{/* Options to update user info
					<div className='update__info'>
						<button onClick={handleUpdateInfo}>Update Info</button>
					</div> */}
				</>
			) : (
				<ProfileLoader />
			)}
		</div>
	);
};

export default UserProfile;
