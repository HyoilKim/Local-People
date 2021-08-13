import React, { useRef } from "react";
import "./Dropdown.css";
import { Avatar } from "@material-ui/core";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import Map from "./DropdownMap";
import { useDispatch, useSelector } from "react-redux";
import firebase, {db} from "../firebase/firebase";
import { Link } from "react-router-dom";
import mime from "mime-types";

const DropdownCustom = ({ username }) => {
  const user = useSelector(state => state.user.currentUser)
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);
  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const inputOpenImageRef = useRef();

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];

    const metadata = {contentType: mime.lookup(file.name)};

    try {
      let uploadTaskSnapshot = await firebase.storage().ref()
        .child(`user_images/${user.uid}`)
        .put(file, metadata)

      await uploadTaskSnapshot.ref.getDownloadURL().then((url) => {
        console.log(typeof(url));
        console.log(db.collection.doc(username));
        db.collection("users").doc(username).update({userImage: url});
        });
        
    } catch (error) {
        console.log(error.message);
    }
  }

  return (
    <div className="menu-container">
      <button onClick={onClick} className="menu-trigger">
        <span>{username}</span>
        <Avatar
          className="feed__avatar"
          alt={username}
          src="/static/images/avatar/1.jpeg"
        ></Avatar>
      </button>
      <nav
        ref={dropdownRef}
        className={`menu ${isActive ? "active" : "inactive"}`}
      >
        <ul>
          <li>
            <Link onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Link>
          </li>
          <li>
            
          </li>
          <li>
            <Link to="/login" onClick={handleLogout}>
              로그아웃
            </Link>
          </li>
          <li>
            <a style={{paddingBottom:"10px"}}>
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
        style={{display:"none"}}>
      </input>
    </div>
  );
};

export default DropdownCustom;
