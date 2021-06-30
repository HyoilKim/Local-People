import React from "react";
import "./Action.css";
import PersonIcon from "@material-ui/icons/Person";
import Map from "../../map/Map.tsx";
import { useSelector } from "react-redux";
import firebase from "../../firebase/firebase";
import Dropdown from "react-bootstrap/Dropdown";

function Action() {
  const currentUser = firebase.auth().currentUser;
  let nickname = "";
  if (currentUser) {
    nickname = currentUser.displayName;
  }

  const user = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle
          style={{
            background: "transparent",
            border: "0px",
          }}
          id="dropdown-basic"
        >
          {nickname} {/*user && user.displayName*/}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">마이페이지</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Map></Map>
      <div className="profile">
        <PersonIcon></PersonIcon>
      </div>
    </div>
  );
}

export default Action;
