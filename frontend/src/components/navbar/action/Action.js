import React from "react";
import "./Action.css";
import PersonIcon from "@material-ui/icons/Person";
import Map from "../../map/Map.tsx";
import { useSelector } from "react-redux";
import firebase from "../../firebase/firebase";
import {Dropdown, DropdownButton} from "react-bootstrap";

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
      <div style={{display: 'flex', marginBottom: '1rem'}}>
        <PersonIcon
          style={{ width: '20px', height: '20px', marginTop: '3px' }}>
        </PersonIcon>
        <Dropdown>
            <DropdownButton style={{background: 'transparent', border: '0px'}} title={nickname}>
              <Dropdown.Item as="button" style={{textAlign: 'center', width: '70px', height: '20px', fontSize: '10px'}}>마이페이지</Dropdown.Item>
              <div>
                <Dropdown.Item as="button" style={{textAlign: 'center', width: '70px', height: '20px', fontSize: '10px'}} onClick={handleLogout}>로그아웃</Dropdown.Item>
              </div>
            </DropdownButton>
        </Dropdown>
        <Map></Map>

      </div>
    </div>    
  );
}

export default Action;
