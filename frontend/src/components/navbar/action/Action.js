import React from "react";
import Button from "../button/Button";
import "./Action.css";
import { Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Map from "../../map/Map.tsx";
import { auth } from "../../firebase/firebase";

const Action = ({ user }) => {
  const onLogOutClick = (e) => {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        console.log("user signed out");
      })
      .catch((error) => {
        console.log("error");
      });
  };
  if (user) {
    return (
      <div className="actions">
        <div className="actions__location">
          <Map></Map>
        </div>
        <button className="actions__logout" onClick={onLogOutClick}>LOG OUT</button>
        
        <div className="profile">
          <PersonIcon></PersonIcon>
          <ArrowDropDownIcon></ArrowDropDownIcon>
        </div>
      </div>
    );
  } else {
    return (
      <div className="actions">
        <Button label="LOG IN" primary="" to="/login"></Button>
        <Button label="SIGN UP" primary="true" to="/signup"></Button>
        <div className="profile">
          <PersonIcon></PersonIcon>
          <ArrowDropDownIcon></ArrowDropDownIcon>
        </div>
      </div>
    );
  }
};

export default Action;
