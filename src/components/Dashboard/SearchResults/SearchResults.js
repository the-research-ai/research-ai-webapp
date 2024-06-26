import React from "react";
import "./SearchResults.css";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

const SearchResults = ({
  isFetchingPapers,
  searchFailed,
  results,
  searchId,
  onClose,
  additionalClassName,
}) => {
  const navigate = useNavigate();
  mixpanel.track_pageview({ page: "Searched Papers" });

  const handleResultClick = (id, paperTitle, paperPublishedDate, pdfUrl) => {
    posthog.capture("open_paper", { paper_id: id, search_id: searchId });
    // mixpanel.track_links("#paper-result", "Clicked to Open Paper");
    mixpanel.track("Clicked to Open Paper");

    navigate(`/paper/${id}`, {
      state: {
        paperTitle,
        paperPublishedDate,
        pdfUrl,
        referrer: "searchResults",
      },
    });
  };
  return (
    <div className={`search-results-overlay ${additionalClassName}`}>
      <div className="search-results-container">
        <IoClose onClick={onClose} className="close-btn" />
        <span className="search-headline">Research papers</span>
        <div className="underline"></div>
        {results.length > 0 ? (
          <div className="result-display-area">
            {results.map((result, index) => (
              <div
                id="paper-result"
                key={index}
                // className="result-item"
                className={`result-item ${
                  result.url === "" || isFetchingPapers ? "disabled" : ""
                }`}
                onClick={() =>
                  handleResultClick(
                    result.id,
                    result.title,
                    result.published,
                    result.url
                  )
                }
              >
                <div className="result-title">{result.title}</div>
                <div className="result-author">{result.authors}</div>
                {result.published && (
                  <div className="result-author">
                    Published on - {result.published}
                  </div>
                )}
                {/* <div className="result-author">
                Published on - {result.published}
              </div> */}
                <div className="result-topics">
                  {result.topics &&
                    result.topics.split(",").map(
                      (topic, index) =>
                        topic.trim() && (
                          <span key={index} className="topic-tag">
                            {topic.trim()}
                          </span>
                        )
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : searchFailed ? (
          <div className="d-flex align-items-center justify-content-center flex-column vh-50">
            <div className="error-text">Unexpected error occurred.</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchResults;
