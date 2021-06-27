import "./App.css";
import React, { useState, useEffect } from "react";
import firebase from "./components/firebase/firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import SignupPage from "./components/SignupPage/SignupPage";
import LoginPage from "./components/LoginPage/LoginPage";
import MainPage from "./components/mainpage/MainPage";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./redux/actions/user_action";

function App(props) {
  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log("user", user);
      // user 있으면 로그인 된 / user 없으면 안 된 상태
      if (user) {
        history.push("/");
        dispatch(setUser(user));
      } else {
        history.push("/login");
        dispatch(clearUser());
      }
    });
  }, [dispatch, history]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh ",
        }}
      >
        <span>로딩 중...</span>
      </div>
    );
  } else {
    return (
      <Switch>
        <Route exact path="/" component={MainPage}></Route>
        <Route exact path="/login" component={LoginPage}></Route>
        <Route exact path="/signup" component={SignupPage}></Route>
      </Switch>
    );
  }
}

export default App;
