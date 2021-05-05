import React from 'react';
import './Chatroom.css'

const Message = ({chat, user}) => (
    <li className={`chat ${user === chat[0] ? "right" : "left"}`}>
        <li className="username">{chat[0]} says: </li>
        <p>{chat[1]}</p>
    </li>
);

export default Message;