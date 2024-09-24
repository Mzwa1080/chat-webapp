import React, { useState, useEffect } from "react";
import queryString from 'query-string'
import io from 'socket.io-client'
import './Chat.css'

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

import { useLocation } from "react-router-dom";

let socket;

const Chat = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const endpoint = 'http://localhost:5000'

    useEffect(() => {
        if (location && location.search) {
            const { name, room } = queryString.parse(location.search);
            socket = io(endpoint);

            setName(name);
            setRoom(room);

            socket.emit('join', { name, room }, (error) => {

                if(error){
                    alert(error)
                }
            })


            return () => {
                socket.emit('disconnect')
                socket.off();
            }

        } 
    }, [location, location.search, endpoint])

 // for handling messages
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages])

// function for sending messages
    const sendMessage =(event) =>{
// peventing the keyPress enter and refreshing of the page
        event.preventDefault();
        
        if(message){
            socket.emit('sendMessage', message,()=> setMessage(''))
        }
    }
    console.log(message,messages);
    
    return (
        <div className="outerContainer">
                <h2>Welcome, {name}!</h2>
            <div className="container">
                <InfoBar room={room}/>

                <Messages messages={messages} name={name} />



                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
           
           
            </div>
        </div>
        )
}

export default Chat;