import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "dompurify";
import ArticleLoader from "../components/Loaders/ArticleLoader";
import CommentSectionLoader from "../components/Loaders/CommentSectionLocader";
import Modal from "../components/Modal/Modal";
import { ToastContainer, Slide, toast } from "react-toastify";
import PlaceHolder from "../components/PlaceHolder";
import PlaceHolderSingle from "../components/PlaceHolderSingle";
// import 'react-toastify/dist/ReactToastify.css';
// import hljs from "highlight.js";
// import 'highlight.js/styles/xcode.css'
import defaultImageDp from '../img/defaultUserImage.svg'

const Single = () => {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(0)
  const [likes, setLikes ] = useState(null)
  const [dislikes, setDislikes ] = useState(null)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [commentText, setCommentText] = useState("");
  const [modalOpen, setModalOpen] = useState(false)

  const [isBlogContentLoading, setBlogContentLoading] = useState(true)
  const [isCommentLoading, setcommentLocading] = useState(true)

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);
  // currentUser.username = 'deep'
  // console.log(currentUser)

  useEffect(() => {
    console.log(likes, dislikes, likeCount, dislikeCount)
    const fetchData = async () => {
      try {

        const res = await axios.get(`/blog/${postId}`);
        const authorId = res.data?.blog?.authorId

        const getAuthorInfo = await axios.get(`/auth/user/${authorId}`)
        res.data.authorInfo = getAuthorInfo.data?.data?.user
        
        // const getComments = await axios.get(`/blog/${postId}/comments`)
        console.log(res.data?.blog)

        const likeArr = res.data?.blog?.likes
        const dislikeArr = res.data?.blog?.dislikes
        
        const likedIndex = likeArr.findIndex((userId) => userId === currentUser?.user_id);
        const dislikedIndex = dislikeArr.findIndex((userId) => userId === currentUser?.user_id);


        if (likedIndex !== -1){
          setLikes(true)
        }else{
          setLikes(false)
        }

        if (dislikedIndex !== -1){
          setDislikes(true)
        }else{
          setDislikes(false)
        }

        setPost(res.data);
        setBlogContentLoading(false)
        setComments(res.data?.comments);
        setcommentLocading(false)
        setCommentCount(res?.data?.comments.length)

        console.log(comments)

        setLikeCount(res.data?.blog?.likeCount)
        setDislikeCount(res.data?.blog?.dislikeCount)

        // console.log(res.data, getAuthorInfo.data?.data?.user)
      } catch (err) {
        console.log(err);
        setBlogContentLoading(false)
        setcommentLocading(false)
        setPost({})
      }
    };
    fetchData();
  }, [postId, likes, dislikes, comments.length]);

  useEffect(()=>{

  },[likes, dislikes])

  const handleDelete = async ()=>{
    try {
      await axios.delete(`/blog/delete/${postId}`);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  const handleLike = async (e) => {
    console.log(e.target.id)
    
    if (!currentUser) {
      setModalOpen(true)
      return
    }

    try {
      var res = await axios.put(`/blog/like/${postId}`);
      // navigate("/")
      // console.log(res)
      
      if (!likes && !dislikes){
        setLikes(!likes)
        setLikeCount(likeCount + 1)
      }
      else if (!likes && dislikes){
        setLikes(!likes)
        setLikeCount(likeCount + 1)
        setDislikes(!dislikes)
        setDislikeCount(dislikeCount - 1)
      }
      else if (likes && !dislikes){
        setLikes(!likes)
        setLikeCount(likeCount - 1)
      }

    } catch (err) {
      console.log(err?.response?.data);
      alert(err?.response?.data?.errors[0]?.message)
    }
  }
  const handleDislike = async (e) => {
    console.log(e.target.id)
    
    if (!currentUser) {
      setModalOpen(true)
      return
    }
    
    try {
      var res = await axios.put(`/blog/dislike/${postId}`);
      // navigate("/")
      let tmp = dislikes

      if (!likes && !dislikes){
        setLikes(!dislikes)
        setDislikeCount(dislikeCount + 1)
      }
      else if (!likes && dislikes){
        setDislikes(!dislikes)
        setDislikeCount(dislikeCount - 1)
      }
      else if (likes && !dislikes){
        setLikes(!likes)
        setLikeCount(likeCount - 1)
        setDislikes(!dislikes)
        setDislikeCount(dislikeCount + 1)
      }

      // console.log(res)
    } catch (err) {
      console.log(err.response.data);
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const toastId = 'posting comment'
    const blogId = e.target.id;
    
    if (!currentUser) {
      setModalOpen(true)
      return
    }

    try {
    
      const response = await axios.post(`/comment/add/`, {
        blogId: blogId,
        body: commentText,
      });

      console.log("Comment added:", response.data)
      toast.success("comment posted successfully", {
        postition: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });
      setCommentText("");
      setComments([...comments, {comment: response.data?.comment}])
      setCommentCount((prevCount) => prevCount + 1)

    } catch (error) {
      console.error("Error adding comment:", error.response.data);
      // alert(error?.response?.data?.errors[0]?.message)
      toast.error(error?.response?.data?.errors[0]?.message || `Something went wrong`, 
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      })
    }
  }

  const handleDeleteComment = async (e) => {
    const commentId = e.currentTarget.id
    const toastId = "delete comment"
    if (!currentUser) {
      setModalOpen(true)
      return
    }

    try {
      await axios.delete(`/comment/delete/${commentId}`);
        
      setComments((prevComments) =>
        prevComments.filter((item) => item.comment._id !== commentId)
      );

      setCommentCount((prevCount) => prevCount - 1);

      toast.success("comment deleted successfully", {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });

    } catch (error) {
      console.error("Error deleting comment:", error.response.data);
      // alert(error?.response?.data?.errors[0]?.message);
      toast.error(error?.response?.data?.errors[0]?.message || `Something went wrong`, 
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      })
    }
  };

  return (
    <>{
      post?.blog || isBlogContentLoading ? 
      <div className="single__post__container">
        
        <div className="single">
          { isBlogContentLoading ? <ArticleLoader /> :
            <div className="content">
              <img src={`${process.env.REACT_APP_STATIC_URI + post?.blog?.images[0] || " "}`} alt="" className="blog__cover__img" />
              <div className="user">
                <div className="user__section_1">
                  {
                    post?.authorInfo?.displayPicture ? <img
                      src={process.env.REACT_APP_STATIC_URI + post?.authorInfo?.displayPicture || " "}
                      alt=""
                    /> : 
                    <img
                      src={defaultImageDp}
                      alt=""
                    />
                  }
                  <div className="info">
                    <span>{post?.authorInfo?.fullname || " "}</span>
                    <p>Posted {moment(post?.blog?.createdAt).fromNow()}</p>
                  </div>
                  {currentUser?.user_id === post?.blog?.authorId && (
                    <div className="edit">
                      <Link to={`/write?edit=2`} state={post?.blog}>
                        <img src={Edit} alt="" className="user_image_edit" />
                      </Link>
                      <img onClick={handleDelete} src={Delete} alt="" className="user_image_delete"/>
                    </div>
                  )}
                </div>
                <div className="user__section_2">
                  <div className="like_dislike">
                    <button className="likeBtn" onClick={handleLike} id={post?.blog?._id}>
                      {/* style={{color: "#d72865",}} */}
                      {/* style={likes === true ? {color: "#d72865",} : {color: "#999"}} */}
                      <FontAwesomeIcon icon={faThumbsUp} style={{ color: "#999", }} />
                      &nbsp; {likeCount}
                    </button>
                    <button className="dislikeBtn" onClick={handleDislike} id={post?.blog?._id}>
                      {/* style={dislikes === true ? {color: "#ccc",} : {color: "#999"}} */}
                      <FontAwesomeIcon icon={faThumbsDown} style={{ color: "#999", }} />
                      &nbsp; {dislikeCount}
                    </button>
                  </div>
                </div>
              </div>
              <h1>{post?.blog?.title}</h1>
              {/* <p
              dangerouslySetInnerHTML={{
                __html: post?.blog?.sanitizedBodyHtml
              }}
              ></p>       */}
              <div
                className="blog__post__body"
                dangerouslySetInnerHTML={{ __html: post?.blog?.sanitizedBodyHtml }}
              ></div>
            </div>
          }
          
          <Menu cat={post?.blog?.categories} />

        </div>
        
        <div className="comment__section__container">

          <div className="comment__header">
            <h2>All comments ({commentCount})</h2>
            <br />
            <hr />
          </div>
          <div className="comment__section__body">
            <div className="comment__form">
              <h3>Leave a comment</h3>
              <form>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your comment here..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="commentBtn" id={post?.blog?._id} onClick={handleCommentSubmit}>
                  Post Comment
                </button>
              </form>
            </div>
            {isCommentLoading ? <CommentSectionLoader /> :
              <div className="comment__list">
                {
                  comments.map((item) => {
                    return (
                      <div className="comment__item" key={item?.comment?._id}>
                        <div className="comment__item__top">
                          <div className="item__top__left">
                            {item?.user?.displayPicture ? <img
                              src={process.env.REACT_APP_STATIC_URI + item?.user?.displayPicture}
                              alt=""
                            /> : 
                            <img
                              src={defaultImageDp}
                              alt=""
                            />
                            }
                            <div className="info">
                              <span>{item?.comment.userName}</span>
                              <p>Posted {moment(item?.comment.createdAt).fromNow()}</p>
                            </div>
                          </div>
                          {/* conditionally render this below div with trash can if current user id is === comment user_id */}

                          {currentUser?.user_id === item?.comment?.userId && (
                            <div className="item__top__right">
                              <button
                                className="deleteBtn"
                                onClick={handleDeleteComment}
                                id={item?.comment?._id}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>
                            </div>
                          )}

                          {/* <div className="item__top__right">
                              </div> */}
                        </div>
                        <div className="comment__item__bottom">
                          {item?.comment?.body}
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            }
          </div>
        </div>

        {modalOpen && <Modal setOpenModal={setModalOpen} />}
        <ToastContainer position="bottom-right" limit={2} />
      
        {/* Same as */}
        {/* <ToastContainer /> */}

      </div>
      :
      <PlaceHolderSingle />
    }
    </>
    
  );
};

export default Single;
