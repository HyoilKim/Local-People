import React from "react";
import "./Nav.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import firebase from "../firebase/firebase";
import DropdownCustom from "../dropdown/DropdownCustom";

const Nav = () => {
  const currentUser = firebase.auth().currentUser;
  let nickname = "";
  if (currentUser) {
    nickname = currentUser.displayName;
  }

  const user = useSelector((state) => state.user.currentUser);

  return (
    <div className="navbar">
      <Link className="navbar__logo" to="/">
        로컬피플
      </Link>
      <DropdownCustom username={nickname}></DropdownCustom>
    </div>
  );
};

export default Nav;
