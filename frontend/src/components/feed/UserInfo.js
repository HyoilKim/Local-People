import React, { Component } from 'react'
import {useSelector} from 'react-redux';
import firebase, { db } from '../firebase/firebase';
import Feed from "./Feed";

export class UserInfo extends Component {

  state = {
    usersRef: firebase.database().ref("users"),
    users: [],
    FeedsNameRef: db.collection('feeds').get(),
    names: [],
    timestamp: new Date().getTime()
  }

  componentDidMount() {
    this.addUsersListeners()
  }


  addUsersListeners = () => {
    const {usersRef} = this.state;
    const {FeedsNameRef} = this.state;
    let feedNameArray = [];

    FeedsNameRef.then((snapshot)=> {
      snapshot.forEach((doc)=>{
        let name = doc.data().username;
        feedNameArray.push(name)
        this.setState({names: feedNameArray})
      })
    })
    console.log(feedNameArray)

    let usersArray = [];
    usersRef.on("child_added", DataSnapshot => {
      if (this.state.name == DataSnapshot.val().nickname) {
        let user = DataSnapshot.val()
        usersArray.push(user)
        this.setState({users: usersArray})
      }

    })

  }

  renderUsers = (users, timestamp) =>
    users.map(user => (
      <li> {user.location} {Math.floor((timestamp-user.creationTime)/86400000)}일동안 거주 중</li>
    ))
  //serverTimestamp
  //각 게시물의 정보마다로 가려면 currentUser로 하면 안됨.
  render() {
    const {users} = this.state;
    const {timestamp} = this.state;
    return (
      <div>
        {this.renderUsers(users, timestamp)}
      </div>
    )
  }
}

export default UserInfo
