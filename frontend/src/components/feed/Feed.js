import { React, useEffect, useState } from "react";
import "./Feed.css";
import Like from "../like/Like";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase/firebase";
import firebase from "../firebase/firebase";

const Feed = ({ postId, user, username, description, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (event) => {
    event.preventDefault();
    db.collection("feeds").doc(postId).collection("comments").add({
      text: comment,
      username: user,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("feeds")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
      console.log(comments);
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="feed">
      <div className="feed__header">
        <Avatar
          className="feed__avatar"
          alt={username}
          src="/static/images/avatar/1.jpeg"
        ></Avatar>
        <h3>{username}</h3>
        {/*header -> profileimage + username */}
      </div>

      <img className="feed__image" src={imageUrl} alt="feed__image" />
      {/*image*/}

      <div className="feed__section">
        <Like></Like>
      </div>

      <h4 className="feed__text">
        <strong>{username}</strong>: {description}
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
