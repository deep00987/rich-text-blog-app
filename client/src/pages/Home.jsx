import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import PaginatedBlogs from "../components/PaginatedBlogs";
import HomePageLoader from "../components/Loaders/HomePageLoader";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true)
  
  const cat = useLocation().search
  // setCategory(cat)
  
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const res = await axios.get(`/blog/filter${cat}`);
        setPosts(res.data.blogs);
        setPostsLoading(false)
        // console.log(res.data)
        console.log(posts)
        // console.log(cat)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    
  }, [cat]);
  // const posts = [
  //   {
  //     id: 1,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 2,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 3,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 4,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  // ];

  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }
  const truncateTxt = (str, n)=>{
    return (str.length > n) ? str.slice(0, n-1) : str;
  }
  
  return (
    <div className="home">
      <div className="posts">
        {
          // posts.map((post) => (
          //   <div className="post" key={post._id}>
          //     <div className="img">
          //       <img src={`${post.images[0]}`} alt="" />
          //     </div>
          //     <div className="content">
          //       <Link className="link" to={`/post/${post._id}`}>
          //         <h1>{post.title}</h1>
          //       </Link>
          //       <p>{truncateTxt(getText(post.sanitizedBodyHtml), 80)} &hellip;</p>
          //       <button>Read More</button> 
          //     </div>
          //   </div>
          // ))
        }
        {
          postsLoading ? <HomePageLoader /> : <PaginatedBlogs data={posts} itemsPerPage={2}/>
        }  
      </div>
    </div>
  );
};

export default Home;
