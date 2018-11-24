import React from 'react';
import * as AuthManager from "../util/AuthManager";

class ChatRoom extends React.Component {

    constructor(props) {
        super(props);

        this.onLogoutClicked = this.onLogoutClicked.bind(this);
    }

    onLogoutClicked(e) {
        e.preventDefault();

        fetch("/api/users/logout", {
            method: 'GET'
        }).then(resp => {
            // if logout process was successful (response is ok), then logout
            // if response status was Unauthorized (401), it means that cookies was expired, so we logout in frontend too
            if (resp.ok || resp.status === 401) {
                AuthManager.logout();
                this.props.history.push("/");
            } else {
                console.log("Logout failed: " + resp);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="ChatRoom">
                <div className="ChatRoom-header">
                    <h4>NodeChat</h4>
                    <button onClick={this.onLogoutClicked}>Logout</button>
                </div>
                <label>You are in the chat room!</label>
            </div>
        );
    }
}

export default ChatRoom;