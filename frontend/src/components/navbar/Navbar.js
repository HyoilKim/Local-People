import React from "react";
import "./Navbar.css";
import SearchIcon from "@material-ui/icons/Search";

const Navbar = () => {
  return (
    <div className="navbar">
      <img
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="logo"
        className="app__headerImage"
      />
      {/* <label>
        <SearchIcon></SearchIcon>
      </label>*/}
      <input type="text" placeholder="Search"></input>
      <div className="actions">
        <div>Sign Up</div>
        <div>Sign In</div>
        <div>userAvatar</div>
      </div>
    </div>
  );
};

export default Navbar;
