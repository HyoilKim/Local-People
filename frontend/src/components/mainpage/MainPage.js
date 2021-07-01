import React from "react";
import "./MainPage.css";
import Feed from "../feed/Feed";
import { useState, useEffect, useLocation } from "react";
import { db } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import Navbar from "../navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import FeedCreate from "../feedcreate/FeedCreate";

const MainPage = () => {
  const [feeds, setFeeds] = useState([]);
  const user = firebase.auth().currentUser;
  console.log(user.displayName);
  useEffect(() => {
    if (user !== null) {
      const displayName = user.displayName;
      const email = user.email;
    }
  }, []);

  useEffect(() => {
    //this is where the code runs
    db.collection("feeds").onSnapshot((snapshot) => {
      //every single time a new feeds is added, this code runs
      setFeeds(snapshot.docs.map((doc) => ({ id: doc.id, feed: doc.data() })));
    });
  }, []);
  return (
    <Router>
      <div className="app">
        <Navbar />
        {/* Header */}
        <div className="app__body">
          <h1>Hello, This is LocalPeople🦖</h1>
          {/*<CheckboxLabels></CheckboxLabels>*/}
          {feeds.map(({ id, feed }) => (
            <Feed
              key={id}
              postId={id}
              user={user.displayName}
              username={feed.username}
              description={feed.description}
              imageUrl={feed.imageUrl}
            />
          ))}
          {/* Feeds */}
        </div>
      </div>

      {user?.displayName ? (
        <FeedCreate username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </Router>
  );
};

export default MainPage;
