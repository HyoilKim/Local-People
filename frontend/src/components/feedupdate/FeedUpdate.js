import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { db, storage } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import Nav from "../nav/Nav";
import { useHistory } from "react-router-dom";
import "../feedcreate/FeedCreate.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

const FeedUpdate = ({ username }) => {
  const currentUser = firebase.auth().currentUser;
  const classes = useStyles();
  let history = useHistory();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function...

        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside db
            db.collection("feeds").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              description: description,
              imageUrl: url,
              username: currentUser.displayName,
            });

            setProgress(0);
            setDescription("");
            setImage(null);
            history.push("/");
          });
      }
    );
  };

  return (
    <div className="container">
      <Nav></Nav>
      <div className="feedCreate">
        <div className="feedCreate__comment">
          <h3 
            style={{color: "#fb8267", fontSize: "25px", fontWeight:"bold"}}>게시물 수정</h3>
        </div>

        <textarea
          name=""
          id=""
          onChange={(event) => setDescription(event.target.value)}
          placeholder="내용을 입력해주세요"
          value={description}
          className="feedCreate__description"></textarea>
          
      </div>
      <div className="feedCreate__bottom">
        <div className="feedCreate__image">
          <input
            accept="image/*"
            type="file"
            onChange={handleChange}
          />
        </div>
        <div className="feedCreate__button">
          <Button
            variant="contained"
            background
            color="primary"
            onClick={handleUpload}
            className={classes.button}
          >
            업로드
          </Button>
        </div>
      </div>
      {/* <div className="feedCreate__progress">
        <progress value={progress} max="100"></progress>
      </div> */}
    </div>
  );
};

export default FeedUpdate;
