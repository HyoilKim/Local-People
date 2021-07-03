import React from "react";
import "./Nav.css";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Map from "../map/Map.tsx";
import { useSelector } from "react-redux";
import firebase from "../firebase/firebase";
import Dropdown from "react-bootstrap/Dropdown";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownCustom from "../dropdown/DropdownCustom";
import { Row, Col } from "react-bootstrap";

const Nav = () => {
  const currentUser = firebase.auth().currentUser;
  let nickname = "";
  if (currentUser) {
    nickname = currentUser.displayName;
  }

  const user = useSelector((state) => state.user.currentUser);

  return (
    <Container fluid>
      <Row className="navbar">
        <Col>
          <Link className="navbar__logo" to="/">
            <Navbar.Brand>LCPP</Navbar.Brand>
          </Link>
        </Col>
        <Col>
          <DropdownCustom username={nickname}></DropdownCustom>
        </Col>
      </Row>
    </Container>
  );
};

export default Nav;
