import React, { useState, useSelector } from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
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

let isLike = false;

const Like = () => {
  /*
  const [isLiked, setIsLiked] = useState(null);
  const usersRef = firebase.database().ref("feeds.username");
  const user = useSelector(state => state.user.currentUser);

  const handleLike = () => {
    if (isLiked) {
      usersRef
        .child('${user.uid}/liked')
        .remove(err => {
          if(err !== null) {
            console.error(err);
          }
        })
    }
  }*/

  const [count, setCount] = useState(0);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleClick = () => {
    if (isLike === false) {
      isLike = true;
      setCount(count + 1);
    } else {
      setCount(count - 1);
      isLike = false;
      return;
    }
  };

  return (
    <FormGroup>
      <div className="like" style={{ display: "flex" }}>
        <FormControlLabel
          control={
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              name="checkedH"
            />
          }
          label=""
          style={{ width: "30px" }}
          onClick={handleClick}
        />
        <div style={{ display: "flex", marginTop: "12px" }}>
          <h5>{count}명이 좋아합니다</h5>
        </div>
      </div>
    </FormGroup>
  );
};

export default Like;
