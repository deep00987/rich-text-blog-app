import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const UserPasswdForm = ({data}) => {

	const [currentPass, setCurrentPass] = useState(" ")
	const [newPass, setNewPass] = useState(" ")
	const [confirmPass, setConfirmPass] = useState(" ")

	const navigate = useNavigate()
	const {setCurrentUser} = useContext(AuthContext)

	const handleChange = (e) => {
		const { name, value } = e.target;
		switch (name) {
			case 'current_password':
				setCurrentPass(value);
				break;
			case 'new_password':
				setNewPass(value);
				break;
			case 'confirm_password':
				setConfirmPass(value);
				break;
			default:
				break;
		}
  };

	
	const handleSubmit = async (e) => {
		e.preventDefault(); 
    const toastId = "edit pass user"
		const userId = data?.user_id || ""
		console.log(data)
    
		if (!confirmPass || !newPass || !currentPass) {
			toast.warning("All fields required" || "something went wrong", 
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });
			return
		}

		if (confirmPass !== newPass) {
			toast.warning("Both passwords are not same" || "something went wrong", 
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition: Slide
      });
			return
		}
		
		try {
      const response = await axios.put(`/auth/user/update/pass/${userId}`, {new_pass: newPass, current_pass: currentPass});
      // console.log(response?.data)
			setCurrentUser(response?.data?.data?.user)
      toast.success("Password updated", {
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
			<form id="password__form" encType="multipart/form-data" method="POST" className="info__form"
				style={{
					minWidth: 350,
				}}
			>
				<label htmlFor="current_password" className="info__login__labels">Current password</label>
				<input
					required
					type="password"
					placeholder="Enter current password"
					name="current_password"
					id="current_password"
					onChange={handleChange}
				/>
				<label htmlFor="new_password" className="info_login__labels">New password</label>
				<input
					required
					type="password"
					placeholder="Enter new password"
					name="new_password"
					id="new_password"
					onChange={handleChange}
				/>

				<label htmlFor="confirm_password" className="info__login__labels">Confirm password</label>

				<input
					required
					type="password"
					placeholder="Confirm password"
					name="confirm_password"
					id="confirm_password"
					onChange={handleChange}
				/>

				<button onClick={handleSubmit}>Update password</button>

			</form>
			<ToastContainer position='bottom-right' limit={3}/>
		</div>
	)
}

export default UserPasswdForm