import { useEffect, useState } from "react";
import "./Feed.css";
import Like from "../like/Like";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import FeedMore from "./FeedMore";

const Feed = ({
  postId,
  author,
  description,
  imageUrl,
  likedUser,
  lat,
  lon,
}) => {
  function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
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

  const [currentCoords, setCurrentCoords] = useState({
    lat: 33.450701,
    lon: 126.570667,
  });
  const [isCoords, setIsCoords] = useState(false);
  const [distance, setDistance] = useState(0);

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const currentUser = firebase.auth().currentUser;
  let nickname = "";
  if (currentUser) {
    nickname = currentUser.displayName;
  }

  const postComment = (event) => {
    event.preventDefault();
    db.collection("feeds").doc(postId).collection("comments").add({
      text: comment,
      username: nickname,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
      setDistance(
        getDistanceFromLatLonInKm(
          currentCoords.lat,
          currentCoords.lon,
          lat,
          lon
        )
      );
      console.log(distance);
    });
  }

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("feeds")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [postId]);

  return (
    <div className="feed">
      <div className="feed__header">
        <Avatar
          className="feed__avatar"
          alt={author}
          src="/static/images/avatar/1.jpeg"
        ></Avatar>
        <h3>{author}</h3>
        <div
          className="more"
          style={{ marginLeft: "570px", marginTop: "3px" }}
        ></div>
        <FeedMore
          isCurrentUser={author === nickname}
          postId={postId}
        ></FeedMore>
        {/*header -> profileimage + username */}
      </div>

      <img className="feed__image" src={imageUrl} alt="feed__image" />
      {/*image*/}

      <div className="feed__section">
        <Like postId={postId} nickname={nickname} likedUser={likedUser}></Like>
      </div>

      <h4 className="feed__text">
        <strong>{author}</strong>: {description}
      </h4>
      {/*username + description */}
      <div className="feed__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong>&nbsp;{comment.text}
          </p>
        ))}
      </div>

      <form className="feed__commentBox">
        <input
          type="text"
          className="feed__input"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={!comment}
          className="feed__button"
          type="submit"
          onClick={postComment}
        >
          POST
        </button>
      </form>
      {/* comments */}
    </div>
  );
};

export default Feed;
