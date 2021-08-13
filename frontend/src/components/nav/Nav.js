import "./Nav.css";
import { Link } from "react-router-dom";
import firebase from "../firebase/firebase";
import DropdownCustom from "../dropdown/DropdownCustom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Nav = () => {
  const currentUser = firebase.auth().currentUser;
  const user = useSelector(state => state.user.currentUser)
  let nickname = "";
  let userImage = "";
  if (currentUser) {
    //현재 유저가 로그인 상태이면 닉네임을 표시한다.
    nickname = currentUser.displayName;
  }
  useEffect(()=> {
    userImage = firebase.storage().ref().child(`user_images/${currentUser.uid}`)
    nickname = currentUser.displayName;
  },[currentUser])

  return (
    <div className="navbar">
      <Link className="navbar__logo" to="/">
        로컬피플
      </Link>
      <Link to="/"><i class="fas fa-home" style={{fontSize:"20px", color:"#9575cd"}}></i></Link>
      <Link to="/create"><i class="fas fa-edit" style={{fontSize:"20px", color:"#9575cd"}}></i></Link>
      <DropdownCustom username={nickname}></DropdownCustom>
    </div>
  );
};

export default Nav;
