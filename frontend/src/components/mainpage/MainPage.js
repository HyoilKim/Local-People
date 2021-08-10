import "./MainPage.css";
import Feed from "../feed/Feed";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import MarkerView from "../map/MarkerView";
import Nav from "../nav/Nav";

const MainPage = () => {
  const [feeds, setFeeds] = useState([]);
  const [isMap, setIsMap] = useState("false");
  const [currentLocation, setCurrentLocation] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  async function getPosition(options){
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
      
    });
  };

  async function getFeeds(options){
    return new Promise((resolve, reject)=>{
      
      db.collection("feeds")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      //every single time a new feeds is added, this code runs
        
          resolve(snapshot.docs.map((doc) => ({ id: doc.id, feed: doc.data() })));

      })
      
    }
    )}

  const fetchFeeds = async () => {
    const f = await getFeeds();
    setFeeds(f);
  }

  const fetchPosition = async () => {
    const p = await getPosition(); //geolocation에서 현재 위치를 받아온다.
    const pObject = {latitude: p.coords.latitude, longitude: p.coords.longitude};
    setCurrentLocation(pObject); //현재위치의 좌표를 currentLocation에 넣는다.
    
  }

  async function filterFeeds() {
    console.log(currentLocation);
    console.log(feeds);
    setFeeds(feeds => {feeds.filter(({id, feed}) => getDistanceFromLatLonInKm(
      currentLocation.latitude,
      currentLocation.longitude,
      feed.location.lat,
      feed.location.lon
    ) < 10)})
  }


  useEffect(() => {
    //this is where the code runs

  async function loadFeeds() {
    console.time();
    const promises = [];
    promises.push(fetchFeeds());
    promises.push(fetchPosition());
    await Promise.all(promises);
    console.log("load complete \n");
    console.timeEnd();

    return new Promise((resolve) => {resolve();})
  }
    loadFeeds().then(filterFeeds());

  }, []);

  return (
    <div className="app">
      <Nav />
      <div className="app__feed">
        <div className="app__body">
          {feeds == 0 ? (
            <div>로딩중입니다.</div>
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
            {feeds == 0 ? (<div></div>): (<MarkerView feeds={feeds}></MarkerView>)}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
