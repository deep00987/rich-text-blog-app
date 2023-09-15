import React from 'react'
import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import PlaceHolder from './PlaceHolder';

const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
}
const truncateTxt = (str, n)=>{
    return (str.length > n) ? str.slice(0, n-1) : str;
}



function Items({ currentItems }) {

  const navigate = useNavigate()

  const handleReadMoreClick = (e) => {
    navigate(`/post/${e.currentTarget.id}`)
  }

    return (
      <>
        {currentItems && currentItems.length > 0 ? currentItems.map((post) => (
          <div className="post" key={post._id}>
            <div className="img">
              {/* <img src={`../upload/${post.img}`} alt="" /> */}
              <img src={`${process.env.REACT_APP_STATIC_URI}${post.images[0]}`} alt="" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post._id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{truncateTxt(getText(post.sanitizedBodyHtml), 80)} &hellip;</p>
              <button id = {post?._id} onClick={handleReadMoreClick}>Read More</button> 
            </div>
          </div>
        )) 
        : 
        // placeholder component
        (<PlaceHolder />)
        }
      </>
    );
  }




const PaginatedBlogs = (props) => {
    
    const { data, itemsPerPage } = props;
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);

    const currentItems = data.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.length;
        console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    return (
        <>
            <Items currentItems={currentItems} />
            <ReactPaginate
                breakLabel="..."
                nextLabel= {<FontAwesomeIcon icon={faAnglesRight} />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel={<FontAwesomeIcon icon={faAnglesLeft} />}
                renderOnZeroPageCount={null}
                containerClassName='pagination'
                pageLinkClassName='page-num'
                previousLinkClassName='page-num page-num-prev'
                nextLinkClassName='page-num page-num-next'
                activeLinkClassName='active'
            />
        </>
    );
}

export default PaginatedBlogs