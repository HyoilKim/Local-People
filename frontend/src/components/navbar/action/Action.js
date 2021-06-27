import React from "react";
import Button from "../button/Button";
import "./Action.css";
import { Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Map from "../../map/Map.tsx";

const Action = ({ user }) => {
  if (user) {
    return (
      <div className="actions">
        <Map></Map>
        <Button label="LOG OUT" primary="" to="/login"></Button>
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
