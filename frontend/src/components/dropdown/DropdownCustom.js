import React, { useRef } from "react";
import "./Dropdown.css";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import Map from "../map/Map.tsx";
import firebase from "firebase";
import { Link } from "react-router-dom";

const DropdownCustom = ({ username }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);
  const handleLogout = () => {
    firebase.auth().signOut();
  };
  return (
    <div className="menu-container">
      <button onClick={onClick} className="menu-trigger">
        <span>{username}</span>
        <img
          src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/df/df7789f313571604c0e4fb82154f7ee93d9989c6.jpg"
          alt="User avatar"
        />
      </button>
      <nav
        ref={dropdownRef}
        className={`menu ${isActive ? "active" : "inactive"}`}
      >
        <ul>
          <li>
            <a>마이페이지</a>
          </li>
          <li>
            <Link to="/create">업로드</Link>
          </li>
          <li>
            <Link onClick={handleLogout}>로그아웃</Link>
          </li>
          <li>
            <a>
              <Map></Map>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DropdownCustom;
