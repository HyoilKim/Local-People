import { useEffect, useState } from "react";
import "./Feed.css";
import Like from "../like/Like";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import FeedMore from "./FeedMore";
import UserInfo from "./UserInfo";
import CommentMore from "./CommentMore";


const Feed = ({
  postId,
  author,
  description,
  imageUrl,
  likedUser,
  lat,
  lon,
}) => {
  let nickname = "";
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const currentUser = firebase.auth().currentUser;

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

  useEffect(() => {
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
    let getPosition = function (options) {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };
    
    getPosition()
      .then((position) => {
        console.log(
          getDistanceFromLatLonInKm(
            position.coords.latitude,
            position.coords.longitude,
            lat,
            lon
          )
        );
      })
      .catch((e) => {
        console.log(e.message);
      });

    return; //componentWillUnmount
  }, [postId]);

  return (
    <div className="feed">
      <div className="feed__header">
        <div className="feed__header__left">
          <Avatar
            className="feed__avatar"
            // alt={author}
            src="/static/images/avatar/1.jpeg"
          ></Avatar>
          <h3 style={{marginLeft: "5px", marginTop: "8px"}}>{author}</h3>
          <div
            style={{
              marginLeft: "5px",
              marginTop: "20px",
              fontSize: "7px",
            }}>
            <UserInfo></UserInfo>
          </div>
        </div>
        <div style={{width : "20px"}}>
          <FeedMore
            isCurrentUser={author === nickname}
            postId={postId}
          ></FeedMore>
        </div>
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
      {/* <div>
        <CommentMore
          isCurrentUser={author === nickname}
          postId={postId}>
        </CommentMore>
      </div> */}

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
