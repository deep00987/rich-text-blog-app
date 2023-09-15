import React from 'react'
import { Link } from 'react-router-dom'

const UserInfoForm = ({data, handleClick, id}) => {

	const handleChange = (e) => {
		console.log(e.target)
	}

	const handleFileChange = (e) => {
		console.log(e.target)
	}

	const handleSubmit = (e) => {
		console.log(e.target)
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
					onChange={handleChange}
					disabled
					value = {data?.fullname || "fullname"}
				/>
				<label htmlFor="username" className="info_login__labels">Username</label>
				<input
					required
					type="text"
					placeholder="username"
					name="username"
					id="username"
					onChange={handleChange}
					disabled
					value = {data?.username || "password"}
				/>

				<label htmlFor="email" className="info__login__labels">Email address</label>

				<input
					required
					type="email"
					placeholder="email"
					name="email"
					id="email"
					onChange={handleChange}
					disabled
					value = {data?.email || "email"}
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
				
				<button onClick={handleClick} id={id}>Update</button>
			
			</form>
		</div>
	)
}

export default UserInfoForm