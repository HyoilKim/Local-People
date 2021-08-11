import { Component } from 'react'
import "./SignupPage.css"
import firebase from '../firebase/firebase'
    
export class NicknameButton extends Component {

    // function changeButton() {
    //     document.getElementById("button").innerText = "확인완료"
    // }

    // return (
    //     <button onClick={changeButton}>중복 확인</button>
    // )
    state = {
        usersRef : firebase.database().ref("users"),
        users: [],
    }

    componentDidMount() {
        this.addUsersListners()
    }

    addUsersListners = () => {
        const {usersRef} = this.state;
        usersRef.on("child_added", DataSnapshot => {
            let user = DataSnapshot.val()
            usersArray.push(user)
            this.setState({users: usersArray})
        })
    }

    handleClick = () => {
        console.log('click happened')
    }

    render() {
        const {users} = this.state;
        console.log(this.state.users)
        return (
            <div className="nickname__button__box">
                <button onClick={this.handleClick} className="nickname__button">
                    중복확인
                </button>
            </div>
        )
    }
}

export default NicknameButton
