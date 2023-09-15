import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BlogCardLoader from "./Loaders/BlogCardLoader";
import PlaceHolderCard from "./PlaceHolderCard";

const Menu = ({cat}) => {

  const [posts, setPosts] = useState([]);
  const location = useLocation()
  const postId = location.pathname.split("/")[2]
  const [menuLoading, setMenuLoading] = useState(true)

  useEffect(() => {
  
    const fetchData = async () => {
      
      try {
       
        if (cat){
          console.log("category", cat)
          const url =  `/blog/filter?category=${cat[0]?.name}`
          console.log(url)
          var res = await axios.get(url);
          setMenuLoading(false)
          
        }
        setPosts(res?.data?.blogs);
       

      } catch (err) {
        console.log(err);
        setMenuLoading(false)
        
      }
    };
    fetchData();
  }, [cat]);

  const handleBtnClick = (e) => {
    console.log(e.target.id)
    // navigate(`/post/${e.target.id}`)
    window.location = `/post/${e.target.id}`
  }
  
  let iter_count = 0;

  const renderLimitedItems = () => {
    return (
      posts && posts.length > 1 ? posts.map((post) => {
      if (post?._id === postId || iter_count > 2) {
        return null; 
      }

      iter_count++; 

      return (
        <div className="post" key={post?._id}>
          <img src={`${process.env.REACT_APP_STATIC_URI + post?.images[0] || " "}`} alt="" />
          <h2>{post.title}</h2>
          <button onClick={handleBtnClick} id={post?._id}>Read More</button>
        </div>
      );
    }) : 
      ( 
        // <>bal</>
        <PlaceHolderCard category={cat[0]?.name}/>
      )
    );
  };

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {
        menuLoading ? <BlogCardLoader /> : renderLimitedItems()
      }
    </div>
  );
};

export default Menu;
