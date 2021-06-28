import React from "react";
import Button from "../button/Button";
import "./Action.css";
import { Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Map from "../../map/Map.tsx";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const Action = ({ user }) => {
  if (user) {
    return (
      <div className="actions">
        <div className="actions__location">
          <LocationOnIcon></LocationOnIcon>
          <Map></Map>
        </div>

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
