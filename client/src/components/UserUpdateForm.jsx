import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const UserUpdateForm = ({ data }) => {

	const [fullname, setFullName] = useState(data?.fullname || " ")
	const [username, setUsername] = useState(data?.username || " ")
	const [email, setEmail] = useState(data?.email || " ")
	const navigate = useNavigate()
	const {setCurrentUser} = useContext(AuthContext)

	const handleChange = (e) => {
		const { name, value } = e.target;
		switch (name) {
			case 'fullname':
				setFullName(value);
				break;
			case 'username':
				setUsername(value);
				break;
			case 'email':
				setEmail(value);
				break;
			// Add other cases for additional input fields, if any
			default:
				break;
		}
  };

	const handleFileChange = (e) => {
		console.log(e.target)
	}

	const handleSubmit = async (e) => {
		e.preventDefault(); 
    const toastId = "register user"
		const userId = data?.user_id || ""
		console.log(data)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    var formData = new FormData(document.getElementById('user__info__form'));
		formData.delete("displayPicture");
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ' - ' + pair[1]); 
    }

    try {
      const response = await axios.put(`/auth/user/update/${userId}`, formData, config);
      // console.log(response?.data)
			setCurrentUser(response?.data?.data?.user)
      toast.success("success", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });
      // navigate("/");
    } catch (err) {
      console.log(err)
      // setError(err.response?.data?.errors);
      toast.warning(err?.response?.data?.errors[0]?.message || "something went wrong", 
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });
    }
	}

	return (
		<div className="user__info__form">
			<form id="user__info__form" encType="multipart/form-data" method="POST" className="info__form"
				style={{
					minWidth: 350,
				}}
			>
				<label htmlFor="fullname" className="info__login__labels">Full name</label>
				<input
					required
					type="text"
					placeholder="fullname"
					name="fullname"
					id="fullname"
					value={fullname}
					onChange={handleChange}
				/>
				<label htmlFor="username" className="info_login__labels">Username</label>
				<input
					required
					type="text"
					placeholder="username"
					name="username"
					id="username"
					onChange={handleChange}
					value={username}
				/>

				<label htmlFor="email" className="info__login__labels">Email address</label>

				<input
					required
					type="email"
					placeholder="email"
					name="email"
					id="email"
					onChange={handleChange}
					value={email}
				/>
				{/* <label htmlFor="password" className="info__login__labels">Password</label> */}

				{/* <input
					required
					type="password"
					placeholder="password"
					name="password"
					id="password"
					onChange={handleChange}
					disabled

					value = {}

				/> */}
				{/* <label htmlFor="email" className="info__login__labels">Select display picture</label> */}

				{/* <input
					required
					type="file"
					placeholder="displayPicture"
					name="displayPicture"
					id="displayPicture"
					onChange={handleFileChange}
				// value={file}
				/>

				{/* {err && <p>{err[0]?.message}</p>} */}
				{/* <span>
					Do you have an account? <Link to="/login">Login</Link>
				</span>  */}

				<button onClick={handleSubmit}>Update info</button>

			</form>
			<ToastContainer position='bottom-right'/>
		</div>
	)
}

export default UserUpdateForm