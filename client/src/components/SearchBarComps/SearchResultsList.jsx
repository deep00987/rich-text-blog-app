import "./SearchResultsList.css";
import SearchResult from "./SearchResult";

export const SearchResultsList = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result) => {
        return <SearchResult result={result} key={result?._id} />;
      })}
    </div>
  );
};