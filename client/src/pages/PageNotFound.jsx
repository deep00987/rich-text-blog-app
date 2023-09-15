import React from 'react'
import { useNavigate } from 'react-router-dom'
const PageNotFound = () => {
    const navigate = useNavigate()

    return (
        <div class="not__found__container">
            <h1>404 &#124; Page not Found.</h1>
            <h1 class="ascii"> <span >(╯°□°）╯︵ ┻━┻</span></h1>
            <p>
                The page that you are trying to access is not available at the moment or doesn't exist
                <br></br>
                If the issue is unexpexted please submit feeback at my 
                <a href="https://github.com/deep00987" target='blank'> <b>github.</b></a>
            </p>
            <button onClick={()=>{navigate(-1)}}>Go back</button>
        </div>
  )
}

export default PageNotFound