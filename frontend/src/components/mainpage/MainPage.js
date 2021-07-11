import React from "react";
import "./MainPage.css";
import Feed from "../feed/Feed";
import { useState, useEffect, useLocation } from "react";
import { db } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import Nav from "../nav/Nav";
import { BrowserRouter as Router, Link } from "react-router-dom";
import FeedCreate from "../feedcreate/FeedCreate";

const MainPage = () => {
  const [feeds, setFeeds] = useState([]);
  const user = firebase.auth().currentUser;

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

  return (
    <div className="app">
      <Nav />
      <div className="app__body">
        {feeds.map(({ id, feed }) => (
          <Feed
            key={id}
            postId={id}
            author={feed.username}
            description={feed.description}
            imageUrl={feed.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
