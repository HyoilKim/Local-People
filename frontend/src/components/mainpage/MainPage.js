import "./MainPage.css";
import Feed from "../feed/Feed";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import MarkerView from "../map/MarkerView";
import Nav from "../nav/Nav";
import firebase from "../firebase/firebase";
import { setUser } from "../../redux/actions/user_action";

const MainPage = () => {
  const [feeds, setFeeds] = useState([]);
  let currentUser = firebase.auth().currentUser;
  const [time, setTime] = useState();
  const [currentCoords, setCurrentCoords] = useState({});

  useEffect(() => {
    //this is where the code runs

    let currentTime = new Date();

    setTime(currentTime.getTime());

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

    const loadDoc = async () => {
      try {
        var lat, lon;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setCurrentCoords({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            db.collection("feeds")
              .orderBy("timestamp", "desc")
              .onSnapshot((snapshot) => {
                //every single time a new feeds is added, this code runs
                setFeeds(
                  snapshot.docs
                    .map((doc) => ({ id: doc.id, feed: doc.data() }))
                    .filter(
                      ({ id, feed }) =>
                        getDistanceFromLatLonInKm(
                          lat,
                          lon,
                          feed.location.lat,
                          feed.location.lon
                        ) < 100
                    )
                );
              });
          });
        } else {
          console.log("Can't load currentPosition");
          alert("위치인증실패");
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    setTimeout(loadDoc, 1500);
  }, []);

  return (
    <div className="app">
      <Nav />
      <div className="app__feed">
        <div className="app__body">
          {feeds.length == 0 ? (
            <div className="waitment">
              {/* <span>잠시만 기다려주세요..</span> */}
            </div>
          ) : (
            feeds.map(({ id, feed }) => (
              <Feed
                key={id}
                postId={id}
                author={feed.username}
                description={feed.description}
                imageUrl={feed.imageUrl}
                likedUser={feed.likes}
                userCreationTime={feed.userCreatedTime}
                address={feed.address}
                time={time}
              ></Feed>
            ))
          )}
        </div>
        <div className="app__map__container" id="outer_btn_right">
          <div className="app__map">
            {feeds.length == 0 ? (
              <div></div>
            ) : (
              <MarkerView feeds={feeds} userCoords={currentCoords}></MarkerView>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
