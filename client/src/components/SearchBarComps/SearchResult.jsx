import "./SearchResult.css";
import { useNavigate } from "react-router-dom";
const SearchResult = ({ result }) => {
  const navigate = useNavigate()

  return (
    <div
      className="search-result"
      onClick={(e) => {window.location = `/post/${result?._id}`}}
    >
      {result?.title}
    </div>
  );
};

export default SearchResult