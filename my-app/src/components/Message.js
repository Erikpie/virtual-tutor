import React from 'react';
import './Chatroom.css'

const Message = ({chat, user}) => (
    <li className={`chat ${user === chat.username ? "right" : "left"}`}>
        <li className="username">{chat.username} says: </li>
        <p>{chat.content}</p>
    </li>
);

export default Message;