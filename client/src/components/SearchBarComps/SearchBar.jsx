import { useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import "./SearchBar.css";

const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    axios.get("/blog/all")
      .then((response) => response?.data?.blogs)
      .then((blogs) => {
        const results = blogs.filter((blog) => {
          return (
            value &&
            blog &&
            blog?.title &&
            blog?.title.toLowerCase().includes(value)
          );
        });
        console.log(results)
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  // const handleBlueOut = (vlaue) => {
  //   fa
  // }

  return (
    <div className="input-wrapper">
      
      <input
        placeholder="Search blogs ..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        id="search__form"
        name="search__form"
      />
      <label htmlFor="search__form"><span><FontAwesomeIcon icon={faMagnifyingGlass} id="search__icon"/></span></label>
    </div>
  );

};

export default SearchBar