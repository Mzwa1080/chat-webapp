import React, {useState}  from "react";
import {Link} from 'react-router-dom'

import './Join.css';

const Join =()=>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('')

    
    return (
        <div className="joinOuterContainer">
            <div className="JoinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="" className="joinInput mt-20" type="text" onChange={(event=> setName(event.target.value))}  /></div>
                <div><input placeholder="" className="joinInput mt-20"  type="text" onChange={(event)=> setRoom(event.target.value)} /></div>
                <Link onClick={event => (!name || !room)?event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                    <button className="button mt-20" type="button">Sign In</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;