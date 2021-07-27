import "./MainPage.css";
import Feed from "../feed/Feed";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import MarkerView from "../map/MarkerView";
import Nav from "../nav/Nav";
import CheckBox from "../category/Category";

const MainPage = () => {
  const [feeds, setFeeds] = useState([]);
  const user = firebase.auth().currentUser;
  const [isMap, setIsMap] = useState("false");
  const handleClick = () => {
    setIsMap(!isMap);
  };
  const [Filters, setFilters] = useState({
      mock_data: []
  })

  useEffect(() => {
    //this is where the code runs
    db.collection("feeds")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //every single time a new feeds is added, this code runs
        setFeeds(
          snapshot.docs.map((doc) => ({ id: doc.id, feed: doc.data() }))
        );
      });
  }, []);

  const showFilteredResults = (filters) => {
      // TODO: Show rendered feed
  }

  const handleFilters = (filters, category) => {
      const newFilters = {...Filters}

      newFilters[category] = filters

      showFilteredResults(newFilters)
      setFilters(newFilters)

  }

  return (
    <div className="app">
      <Nav />

      <div className="app__body">
        <div className="app__view__button">
          <button>새 소식</button>
          <button onClick={handleClick}>
            {isMap ? "피드로 보기" : "지도로 보기"}
          </button>
        </div>

          <CheckBox
              handleFilters={filters => handleFilters(filters, "mock_data")}
          />

        {isMap ? (
          <MarkerView></MarkerView>
        ) : (
          feeds.map(({ id, feed }) => (
            <Feed
              key={id}
              postId={id}
              author={feed.username}
              description={feed.description}
              imageUrl={feed.imageUrl}
              likedUser={feed.likes}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MainPage;
