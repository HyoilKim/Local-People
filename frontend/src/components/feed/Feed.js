import { useEffect, useState } from "react";
import "./Feed.scss";
import Like from "../like/Like";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import FeedMore from "./FeedMore";
import Comment from "./Comment";

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
  const [dong, setDong] = useState("");
  const [limit, setLimit] = useState(30);
  const [userImageURL, setUserImageURL] = useState("");

  const toggleEllipsis = (str, limit) => {
    return {
      string: str.slice(0, limit),
      isShowMore: str.length > limit,
    };
  };

  const [commentLimit, setCommentLimit] = useState(-2);

  const deleteComment = (id) => () => {
    if (postId) {
      db.collection("feeds")
        .doc(postId)
        .collection("comments")
        .doc(id)
        .delete()
        .then(() => {
          console.log("your comments successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const onClickMoreComments = (arr) => () => {
    setCommentLimit(arr.length);
  };

  const onClickMore = (str) => () => {
    setLimit(str.length);
  };

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
    setDuration(Math.ceil(differ / 86400000));
    const arr = address.split(" ");
    setDong(arr[arr.length - 1]);

    if (postId) {
      db.collection("feeds")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, comment: doc.data() }))
          );
        });
      db.collection("users")
        .doc(author)
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (doc.data().userAvatarUrl !== null) {
              setUserImageURL(doc.data().userImage);
            }
          }
        });
    }

    return () => {}; //componentWillUnmount
  }, [postId]);

  return (
    <div className="feed">
      <div className="feed__header">
        <div className="feed__header__left">
          <Avatar
            className="feed__avatar"
            // alt={author}
            src={userImageURL}
          ></Avatar>
          <h3 style={{ marginLeft: "5px", marginTop: "8px" }}>{author}</h3>
          <div
            style={{
              marginLeft: "5px",
              marginTop: "15px",
              justifyContent: "center",
              fontSize: "10px",
              alignItems: "center",
            }}
          >
            {dong} 거주 {duration}일차
          </div>
        </div>
        <div style={{ width: "20px" }}>
          <FeedMore
            isCurrentUser={author === nickname}
            postId={postId}
          ></FeedMore>
        </div>
        {/*header -> profileimage + username */}
      </div>
      <div className="image__container">
        <img className="feed__image" src={imageUrl} alt="feed__image" />
        {/*image*/}
      </div>

      <div className="feed__section">
        <Like postId={postId} nickname={nickname} likedUser={likedUser}></Like>
      </div>

      <h4 className="feed__text">
        <strong>{author}</strong>: {toggleEllipsis(description, limit).string}
        {toggleEllipsis(description, limit).isShowMore && (
          <button
            className="feed__morebutton"
            onClick={onClickMore(description)}
          >
            ..더보기
          </button>
        )}
      </h4>
      {/*username + description */}
      <div className="feed__comments">
        {comments.length !== 0 ? (
          <p className="comment__title">댓글</p>
        ) : (
          <div></div>
        )}
        {comments.map(({ id, comment }) => (
          <p key={comment.timestamp} className="comment__section">
            <strong>{comment.username}</strong>&nbsp;{comment.text}
            {comment.username == nickname ? (
              <button
                onClick={deleteComment(id)}
                className="comment_delete_button"
              >
                X
              </button>
            ) : (
              <span></span>
            )}
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
