import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from 'react-toastify';

const Write = () => {
  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || "");
  const [tags, setTags] = useState(state?.tags || "");
  const [body, setBody] = useState(state?.body || "");
  const [images, setImages] = useState(null);
  const [categories, setCategories] = useState(state?.categories[0]?.name || "");

  const modules = {
    syntax: true,
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  }

  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault();
    const toastId = 'write blog'
    // const imgUrl = await upload();
    // console.log(title, tags, body, images, categories)
    const data = new FormData()
    data.append("title", title)
    data.append("tags", tags)
    data.append("body", body)
    data.append("images", images)
    data.append("categories", categories)

    for (var pair of data.entries()) {
      console.log(pair[0]+ ' - ' + pair[1]);
    }

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };


    let response;
    try {
      if (state){
        response = await axios.put(`/blog/update/${state._id}`, data, config)
        
        toast.success("Updated successfully", {
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          toastId,
          transition:Slide
        });
        navigate(`/post/${response?.data?.data?._id}`)
      }else{
        response = await axios.post(`/blog/add`, data, config);
        toast.success("Posted successfully", {
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          toastId,
          transition:Slide
        });
        navigate(`/post/${response?.data?.data?._id}`)
      }
    } catch (err) {
      console.log(err.response?.data);
      // alert(err.response?.data?.errors[0]?.message)
      toast.warning(err?.response?.data?.errors[0]?.message || "something went wrong", 
      {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        toastId,
        transition:Slide
      });
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="tags"
          placeholder="tags seperated by comma"
          id="tags"
          name="tags"
          onChange={(e) => setTags(e.target.value)}
          value={tags}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            id="body"
            name="body"
            value={body}
            onChange={setBody}
            modules={modules}
          />
        </div>
      </div>
      <div className="menuContainer">
        <div className="menu">
          <div className="item">
            <h1>Publish</h1>
            <span>
              <b>Status: </b> Draft
            </span>
            <span>
              <b>Visibility: </b> Public
            </span>
            <label className="file" htmlFor="file">
              Upload blog cover image
            </label>
            <input
              // style={{ display: "none" }}
              type="file"
              id="images"
              name="images"
              placeholder="uplaod cover img"
              onChange={(e) => setImages(e.target.files[0])}
            />
            <div className="buttons">
              <button>Save as a draft</button>
              <button onClick={handleClick}>Publish</button>
            </div>
          </div>
          <div className="item">
            <h1>Category</h1>
            <div className="cat">
              <input
                type="radio"
                checked={categories === "art"}
                name="cat"
                value="art"
                id="art"
                onChange={(e) => setCategories(e.target.value)}
              />
              <label htmlFor="art">Art</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={categories === "science"}
                name="categories"
                value="science"
                id="science"
                onChange={(e) => setCategories(e.target.value)}
              />
              <label htmlFor="science">Science</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={categories === "technology"}
                name="cat"
                value="technology"
                id="technology"
                onChange={(e) => setCategories(e.target.value)}
              />
              <label htmlFor="technology">Technology</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={categories === "cinema"}
                name="cat"
                value="cinema"
                id="cinema"
                onChange={(e) => setCategories(e.target.value)}
              />
              <label htmlFor="cinema">Cinema</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={categories === "design"}
                name="cat"
                value="design"
                id="design"
                onChange={(e) => setCategories(e.target.value)}
              />
              <label htmlFor="design">Design</label>
            </div>
            <div className="cat">
              <input
                type="radio"
                checked={categories === "food"}
                name="cat"
                value="food"
                id="food"
                onChange={(e) => setCategories(e.target.value)}
              />
              <label htmlFor="food">Food</label>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right"/>
    </div>
  );
};

export default Write;
