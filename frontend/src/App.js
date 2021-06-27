import "./App.css";
import Feed from "./components/feed/Feed";
import { useState, useEffect } from "react";
import { db } from "./components/firebase/firebase";
import Navbar from "./components/navbar/Navbar";
import CheckboxLabels from "./components/checkbox/Checkbox";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const App = () => {
  const [feeds, setFeeds] = useState([]);

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
              username={feed.username}
              description={feed.description}
              imageUrl={feed.imageUrl}
            />
          ))}
          {/* Feeds */}
        </div>
      </div>
    </Router>
  );
};

export default App;
