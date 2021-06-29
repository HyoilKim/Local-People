import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import { db, storage } from "../firebase/firebase";
import firebase from "../firebase/firebase";

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
  const classes = useStyles();

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
              username: username,
            });

            setProgress(0);
            setDescription("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div>
      <progress value={progress} max="100"></progress>
      <input accept="image/*" type="file" onChange={handleChange} />

      <input
        type="text"
        name=""
        id=""
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Enter a description"
        value={description}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        className={classes.button}
      >
        Post
      </Button>
    </div>
  );
};

export default FeedCreate;
