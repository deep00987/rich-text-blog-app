import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const UserDpForm = ({data}) => {
	const [file, setFile] = useState(null)
	const navigate = useNavigate()
	const {setCurrentUser} = useContext(AuthContext)

	const handleChange = (e) => {
		const { name, value } = e.target;
		switch (name) {
			case 'displayPicture':
				setFile(value);
        console.log(file)
				break;
			// Add other cases for additional input fields, if any
			default:
				break;
		}
  };

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

    var formData = new FormData(document.getElementById('user__dp__form'));
		// formData.delete("displayPicture");
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ' - ' + pair[1]); 
    }

    try {
      const response = await axios.put(`/auth/user/update/pic/${userId}`, formData, config);
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
			<form id="user__dp__form" encType="multipart/form-data" method="POST" className="info__form"
				style={{
					minWidth: 350,
				}}
			>
				<label htmlFor="displayPicture" className="info__login__labels">Select display picture</label>
				<input
					required
					type="file"
					placeholder="displayPicture"
					name="displayPicture"
					id="displayPicture"
					onChange={handleChange}
				
				/>
				<button onClick={handleSubmit}>Update picture</button>
			</form>
			<ToastContainer position='bottom-right' limit={2}/>
		</div>
	)
}

export default UserDpForm