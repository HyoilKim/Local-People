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

const Like = ({ postId, nickname, likedUser }) => {
  const [userList, setUserList] = useState([]);
  const checkUser = (element) => {
    if (element === nickname) {
      return true;
    }
  };
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("feeds")
        .doc(postId)
        .onSnapshot((snapshot) => {
          setUserList(snapshot.data().likes);
          setCount(snapshot.data().likes.length);
          setIsLike(snapshot.data().likes.some(checkUser));
        });
      console.log(userList);
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postLike = () => {
    db.collection("feeds")
      .doc(postId)
      .update({ likes: [...userList, nickname] });
  };

  const deleteLike = () => {
    db.collection("feeds")
      .doc(postId)
      .update({
        likes: userList.filter((element) => element !== nickname),
      });
  };
  const [isLike, setIsLike] = useState(likedUser.some(checkUser));
  const [count, setCount] = useState(0);
  console.log(isLike);
  const handleChange = (event) => {
    if (isLike === false) {
      postLike();
    } else {
      deleteLike();
    }
  };

  const handleClick = () => {};

  return (
    <FormGroup>
      <div className="like" style={{ display: "flex" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isLike}
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
