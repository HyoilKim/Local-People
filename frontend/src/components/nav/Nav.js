import "./Nav.css";
import { Link } from "react-router-dom";
import firebase from "../firebase/firebase";
import DropdownCustom from "../dropdown/DropdownCustom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import FeedCreate from "../feedcreate/FeedCreate";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Nav = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const currentUser = firebase.auth().currentUser;
  const user = useSelector((state) => state.user.currentUser);
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
              <Modal
                style={customStyles}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
              >
                <h3
                  style={{
                    color: "#9575cd",
                    fontSize: "25px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  게시물 만들기
                </h3>
                <div className="X_button">
                  <button
                    className="exit__button"
                    onClick={() => setModalIsOpen(false)}
                  >
                    X
                  </button>
                </div>
                <hr style={{ marginTop: "5px" }}></hr>
                <FeedCreate></FeedCreate>
              </Modal>
              <Link
                className="link__color"
                onClick={() => setModalIsOpen(true)}
              >
                <i className="fas fa-edit" style={{ fontSize: "20px" }}></i>
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
