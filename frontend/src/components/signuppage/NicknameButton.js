import { Component } from 'react'
import "./SignupPage.css"
import firebase from '../firebase/firebase'
    
export class NicknameButton extends Component {

    state = {
        usersRef : firebase.database().ref("users")
    }

    componentDidMount() {
        this.addUsersListners()
    }

    addUsersListners = () => {
        const {usersRef} = this.state;
        usersRef.on("child_added", DataSnapshot => {
            
        })
    }
    render() {
        return (
            <div className="nickname__button__box">
                <button className="nickname__button">
                    중복확인
                </button>
            </div>
        )
    }
}

export default NicknameButton
