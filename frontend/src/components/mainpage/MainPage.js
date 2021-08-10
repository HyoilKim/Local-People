import "./MainPage.css";
import Feed from "../feed/Feed";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import MarkerView from "../map/MarkerView";
import Nav from "../nav/Nav";

const MainPage = () => {
  const [feeds, setFeeds] = useState([]);
  const [isMap, setIsMap] = useState("false");
  const handleClick = () => {
    setIsMap(!isMap);
  };

  useEffect(() => {
    //this is where the code runs
    function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
      //두 점의 위경도좌표를 받아 거리 return
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }
      const R = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      
      return d;
    }
    let getPosition =(options) => {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    db.collection("feeds")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //every single time a new feeds is added, this code runs
        getPosition()
        .then((position) => {
          setFeeds(
            snapshot.docs.map((doc) => ({ id: doc.id, feed: doc.data() })).filter(({id, feed}) => getDistanceFromLatLonInKm(
              position.coords.latitude,
              position.coords.longitude,
              feed.location.lat,
              feed.location.lon
            ) < 10)
            
          );
        })
        .catch((e) => {
          console.log(e.message);
        })
      });

  }, []);

  return (
    <div className="app">
      <Nav />
      <div className="app__feed">
        <div className="app__body">
          {isMap === true ? (
            <MarkerView feeds={feeds}></MarkerView>
          ) : (
            feeds.map(({ id, feed }) => (
              <Feed
                key={id}
                postId={id}
                author={feed.username}
                description={feed.description}
                imageUrl={feed.imageUrl}
                likedUser={feed.likes}
                lat={feed.location.lat}
                lon={feed.location.lon}
              ></Feed>
            ))
          )}
        </div>
        <div className="app__map__container">
          <div className="app__map">
            <MarkerView feeds={feeds}></MarkerView>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
