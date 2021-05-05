import React from 'react';
import ReactDOM from 'react-dom';
import './Chatroom.css';
import {getUpdate, initRoom, sendMessage} from '../database.tsx';

import Message from './Message.js';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [{
                username: "Virtual Tutor Room",
                content: "Connected to tutor room!"
            }]
        };

        initRoom(this)

        setInterval(() => {
			getUpdate(this);
		}, 1000);

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    // need to fix some s
    submitMessage(e) {
        e.preventDefault();

        this.setState({
            chats: this.state.chats.concat([{
                username: "Student-Placeholder",
                content: ReactDOM.findDOMNode(this.msg).value
            }])
        }, () => {
            ReactDOM.findDOMNode(this.msg).value = "";
        });

        let message = this.state.chats + this.state.chats.username + ":" + this.state.chats.content + "\n"
        sendMessage(this, message);
    }

    render() {
        const username = "Student-Placeholder";
        const { chats } = this.state;

        return (
            <div className="chatroom">
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) => 
                            
                            <Message chat={chat} user={username} />
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Chatroom;