import React, { useState, useRef, useEffect } from "react";
import "./Dropdown.css";
import { Avatar } from "@material-ui/core";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import Map from "./DropdownMap";
import { useSelector } from "react-redux";
import firebase, { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import mime from "mime-types";

const DropdownCustom = ({ username }) => {
  const user = useSelector((state) => state.user.currentUser);
  const dropdownRef = useRef(null);
  const [userImageURL, setUserImageURL] = useState();
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);
  const handleLogout = () => {
    firebase.auth().signOut();
  };

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.displayName)
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (doc.data().userAvatarUrl !== null) {
              setUserImageURL(doc.data().userImage);
            }
          }
        });
    }
  }, []);

  const inputOpenImageRef = useRef();

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];

    const metadata = { contentType: mime.lookup(file.name) };

    try {
      let uploadTaskSnapshot = await firebase
        .storage()
        .ref()
        .child(`user_images/${user.uid}`)
        .put(file, metadata);

      await uploadTaskSnapshot.ref.getDownloadURL().then((url) => {
        console.log(typeof url);
        console.log(db.collection("users").doc(username));
        var snapshot = db.collection("users").doc(username);
        snapshot.update({ userImage: url });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="menu-container">
      <button onClick={onClick} className="menu-trigger">
        <span>{username}</span>
        <Avatar
          className="feed__avatar"
          alt={username}
          src={userImageURL}
        ></Avatar>
      </button>
      <nav
        ref={dropdownRef}
        className={`menu ${isActive ? "active" : "inactive"}`}
      >
        <ul>
          <li>
            <Link onClick={handleOpenImageRef}>프로필 사진 변경</Link>
          </li>
          <li></li>
          <li>
            <Link to="/login" onClick={handleLogout}>
              로그아웃
            </Link>
          </li>
          <li>
            <a style={{ paddingBottom: "10px" }}>
              <Map></Map>
            </a>
          </li>
        </ul>
      </nav>
      <input
        onChange={handleUploadImage}
        accept="image/jpeg, image/png"
        type="file"
        ref={inputOpenImageRef}
        style={{ display: "none" }}
      ></input>
    </div>
  );
};

export default DropdownCustom;
