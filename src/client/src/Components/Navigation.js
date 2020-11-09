import React from 'react';
import {Link } from 'react-router-dom';

export class Navigation extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/lobby">Lobby</Link></li>
        </ul>
    }
}

export default Navigation;