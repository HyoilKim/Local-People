import "./Nav.css";
import { Link } from "react-router-dom";
import firebase from "../firebase/firebase";
import DropdownCustom from "../dropdown/DropdownCustom";
import { useEffect } from "react";

const Nav = () => {
  const currentUser = firebase.auth().currentUser;
  let nickname = "";
  if (currentUser) {
    //현재 유저가 로그인 상태이면 닉네임을 표시한다.
    nickname = currentUser.displayName;
  }
  useEffect(() => {
    nickname = currentUser.displayName;
  }, [currentUser]);

  return (
    <div className="navbar__container">
      <div className="navbar">
        <div className="navbar__logo">
          <div className="Igw0E rBNOH  eGOV_  ybXk5  _4EzTm  ">
            <div className="cq2ai">
              <Link className="logo__link" to="/">
                <div className="s4Iyt">로컬피플</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="navbar__menu">
          <div className="navbar__post">
            <div className="navbar__icon">
              <Link className="link__color" to="/">
                <i class="fas fa-home" style={{ fontSize: "20px" }}></i>
              </Link>
            </div>
            <div className="navbar__icon">
              <Link className="link__color" to="/create">
                <i class="fas fa-edit" style={{ fontSize: "20px" }}></i>
              </Link>
            </div>
          </div>
          <div>
            <DropdownCustom username={nickname}></DropdownCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
