import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { db, storage } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import Nav from "../nav/Nav";
import { useHistory } from "react-router-dom";
import "./FeedCreate.css";

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

const FeedCreate = ({ username }) => {
  const currentUser = firebase.auth().currentUser;
  const classes = useStyles();
  const [isCoords, setIsCoords] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({
    lat: 33.450701,
    lon: 126.570667,
  });
  let history = useHistory();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const handleClick = () => {
    const locationButton = document.getElementById("locationButton");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsCoords(true);
        locationButton.innerText = "위치인증완료";
      });
    } else {
      console.log("Can't load currentPosition");
      locationButton.innerText = "위치인증실패";
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (isCoords === true) {
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
                likes: [],
                location: currentCoords,
              });

              setProgress(0);
              setDescription("");
              setImage(null);
              history.push("/");
            });
        }
      );
    } else {
      alert("위치인증이 필요합니다.");
    }
  };

  return (
    <div className="container">
      <Nav></Nav>
      <div className="feedCreate">
        <progress value={progress} max="100"></progress>
        <input
          accept="image/*"
          type="file"
          onChange={handleChange}
          className="feedCreate__image"
        />

        <input
          type="text"
          name=""
          id=""
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter a description"
          value={description}
          className="feedCreate__description"
        />

        <Button
          variant="contained"
          className="feedCreate__button"
          color="primary"
          onClick={handleClick}
          className={classes.button}
          id="locationButton"
        >
          위치인증하기
        </Button>
        <Button
          variant="contained"
          className="feedCreate__button"
          color="primary"
          onClick={handleUpload}
          className={classes.button}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default FeedCreate;
