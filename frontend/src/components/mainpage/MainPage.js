import "./MainPage.css";
import Feed from "../feed/Feed";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import MarkerView from "../map/MarkerView";
import Nav from "../nav/Nav";
import firebase from "../firebase/firebase";

const MainPage = () => {
  const [feeds, setFeeds] = useState([]);
  const currentUser = firebase.auth().currentUser;
  const [time,setTime] = useState();
  
  
  let data;

  useEffect(() => {
    //this is where the code runs
    
    let lat, lon;
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
      try{
        const doc = await db.collection("users").doc(currentUser.displayName).get();
        data = doc.data();
        if(data)
        {
          if(currentUser)
          {
            db.collection("users").doc(currentUser.displayName).get().then((doc) => {
              if (doc.exists) {
                console.log(doc.data().coords);
                lat = doc.data().coords.lat;
                lon = doc.data().coords.lon;
                console.log(doc.data());
                return doc.data();
              }
            }).then((position) => {
              db.collection("feeds")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
              //every single time a new feeds is added, this code runs
              console.log(position.coords)
                setFeeds(
                  snapshot.docs.map((doc) => ({ id: doc.id, feed: doc.data() })).filter(({id, feed}) => getDistanceFromLatLonInKm(
                    position.coords.lat,
                    position.coords.lon,
                    feed.location.lat,
                    feed.location.lon
                  ) < 400)
                  
                );
            });
            console.log("effect");
            })
          }
        }else{
          console.log("Not found");
        }
      
      }
      catch(e){
        console.log(e.message);
      }
    }
    setTimeout(loadDoc, 1500);
     

  }, []);

  return (
    <div className="app">
      <Nav />
      <div className="app__feed">
        <div className="app__body">
          {feeds.length == 0 ? (
            <div>게시물이 아직 없어요...😢</div>
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
        <div className="app__map__container">
          <div className="app__map">
            {feeds.length==0?(<div></div>):(<MarkerView feeds={feeds}></MarkerView>)}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;