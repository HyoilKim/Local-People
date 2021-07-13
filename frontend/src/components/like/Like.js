import React, { useState, useEffect, useSelector } from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import { db } from "../firebase/firebase";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import firebase from "../firebase/firebase";
/* const GreenCheckbox = withStyles({

  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />); */

const Like = ({ postId, nickname }) => {
  const [userList, setUserList] = useState([]);
  const checkUser = (element) => {
    if (element.username === nickname) {
      return true;
    }
  };
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("feeds")
        .doc(postId)
        .collection("likes")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setUserList(snapshot.docs.map((doc) => doc.data().username));
        });
      console.log(userList);
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const [isLike, setIsLike] = useState({ checkedH: userList.some(checkUser) });
  const [count, setCount] = useState(userList.length);
  console.log(count)
  const handleChange = (event) => {
    if (isLike.checkedH === false) {
      setCount(count);
      postLike();
    } else {
      setCount(count);
    }
    setIsLike({ ...isLike, [event.target.name]: event.target.checked });
  };

  const postLike = () => {
    db.collection("feeds").doc(postId).collection("likes").add({
      username: nickname,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setCount();
  };

  const handleClick = () => {};

  return (
    <FormGroup>
      <div className="like" style={{ display: "flex" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isLike.checkedH}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              name="checkedH"
            />
          }
          label=""
          style={{ width: "30px" }}
          onChange={handleChange}
        />
        <div style={{ display: "flex", marginTop: "12px" }}>
          <h5>{count}명이 좋아합니다</h5>
        </div>
      </div>
    </FormGroup>
  );
};

export default Like;
