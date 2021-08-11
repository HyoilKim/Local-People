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
  userCreationTime,
  address,
  
}) => {
  let nickname = "";
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const currentUser = firebase.auth().currentUser;
  const [duration, setDuration] = useState();
  

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
    const now = Date.now();
    const differ = now - userCreationTime;
    console.log(differ);
    setDuration(Math.floor(differ/86400000));
    
    
    
    if (postId) {
      db
        .collection("feeds")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    

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
            {address} 거주 {duration}일차
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
