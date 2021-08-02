import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

const Like = ({ postId, nickname, likedUser }) => {
  const [userList, setUserList] = useState([]);
  const checkUser = (element) => {
    if (element === nickname) {
      //리스트 element 중 현재 유저의 닉네임과 일치하면 true 아니면 false
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
          if (snapshot.data().likes) {
            setUserList(snapshot.data().likes); // 좋아요 누른 유저 리스트
            setCount(snapshot.data().likes.length); // 좋아요 누른 유저 리스트의 길이
            setIsLike(snapshot.data().likes.some(checkUser)); //좋아요리스트 중 현재 유저가 있는지 없는지 redirect가 여러번 되는 문제가 있긴하다.
          }
        });
    }
    if(navigator.geolocation)
    return () => {
      unsubscribe();
    };
  }, [postId, checkUser]);
  const postLike = () => {
    db.collection("feeds")
      .doc(postId)
      .update({ likes: [...userList, nickname] });
  };

  const deleteLike = () => {
    db.collection("feeds")
      .doc(postId)
      .update({
        likes: userList.filter((element) => element !== nickname), //db 상에 있는 유저리스트 중 현재 유저와 같은 요소가 없도록 필터링
      });
  };
  const [isLike, setIsLike] = useState(likedUser.some(checkUser));
  const [count, setCount] = useState(0);
  const handleChange = (event) => {
    if (isLike === false) {
      postLike();
    } else {
      deleteLike();
    }
  };

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
