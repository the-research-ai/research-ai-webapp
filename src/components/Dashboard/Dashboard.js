import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
// import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import UserControlPanel from "../UserControlPanel/UserControlPanel";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import LatestPapers from "./LatestPapers/LatestPapers";
import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

const Dashboard = () => {
  const { isLoading } = useKindeAuth();
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const {
    searchResults,
    setSearchResults,
    searchId,
    setSearchId,
    searchQuery,
    setSearchQuery,
    searchMode,
    setSearchMode,
  } = useSearch();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isFetchingPapers, setIsFetchingPapers] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const cachedName = localStorage.getItem("userName");
    if (cachedName) {
      setUserName(cachedName);
      posthog.identify(cachedName);
      mixpanel.identify(cachedName);
      mixpanel.track_pageview({ page: "Dashboard Page" });
    }
  }, []);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      posthog.capture("fetched_search_results", { search_id: searchId });
      mixpanel.track("Featched Search Results", { search_id: searchId });
      setShowSearchResults(true);
    }
  }, [searchResults]);

  useEffect(() => {
    console.log(searchFailed);
    if (searchFailed && searchResults.length === 0) setShowSearchResults(true);
    // if (setSearchFailed !== null) {
    //   setShowSearchResults(true);
    // }
  }, [searchResults, searchFailed]);

  const getGreetingBasedOnTime = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };
  const greeting = getGreetingBasedOnTime();

  const closeShowResults = () => {
    setShowSearchResults(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchFailed(false);
    posthog.capture("closed_search_results", { search_id: searchId });
    mixpanel.track("Closed Search Results", { search_id: searchId });
  };

  if (isLoading && !userName) {
    return (
      <div className="d-flex align-items-center flex-column vh-100 loading-screen">
        <div
          className="spinner spinner-grow spinner-dimension"
          role="status"
        ></div>
        <div className="loading-text-headline">
          Loading Profile, please wait...
        </div>
        <div>
          (If you do not get automatically redirected, please Refresh the page
          and try again)
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard d-flex flex-row">
      <UserControlPanel />
      <div className="dashboard-main-container d-flex flex-row flex-grow-1">
        {/* <div className="dashboard-main-container"> */}
        <div className="left-section d-flex flex-column flex-grow-1">
          <span className="greeter">
            {greeting}, {userName || "User"}
          </span>
          <SearchBar
            setSearchResults={setSearchResults}
            setSearchId={setSearchId}
            setSearchQuery={setSearchQuery}
            setSearchMode={setSearchMode}
            searchQuery={searchQuery}
            searchMode={searchMode}
            setIsFetchingPapers={setIsFetchingPapers}
            isFetchingPapers={isFetchingPapers}
            setSearchFailed={setSearchFailed}
            setCurrentPage={setCurrentPage}
            additionalClassName={showSearchResults ? "raised" : ""}
          />
          <LatestPapers />
        </div>
        <div className="right-section d-flex flex-grow-1"></div>
        {showSearchResults && (
          <SearchResults
            isFetchingPapers={isFetchingPapers}
            searchFailed={searchFailed}
            results={searchResults}
            searchId={searchId}
            onClose={closeShowResults}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            additionalClassName="active"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
