import React from 'react';
import "./lobby.css";
import socket from "../Utilities/socketConfig";
import logger from '../Utilities/logger';


export class LobbyChat extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            message: ""
        }

    }
    
    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
      };

    sendMessage = async(e)=>{
        if (!this.state.message){
            return
        }
        logger.log('chat', `[${this.props.room}]: ${this.state.message}`, this.props.user_name)
        e.preventDefault();
        await socket.emit("chatMessagePlayer", {user_name: this.props.user_name, message: this.state.message, date: new Date()})
        this.setState({message:""})
    }

    componentDidUpdate(prevProps){
        if (prevProps.msgs && this.props.msgs && prevProps.msgs.length !== this.props.msgs.length){
            this.chat_container.scrollTop = this.chat_container.scrollHeight
        }
    }

    render () {
        return <div className="card chat">
            <div className="card-body ">
                <div className="ml-1 mb-1 overflow-auto display" ref={(ref)=> this.chat_container = ref}>
                    {this.props.msgs}
                </div>
                <div className="input-group">
                    <input name="message" value={this.state.message} onChange={(e)=>this.onChange(e)} onKeyPress={(e)=>{if (e.key==="Enter") this.sendMessage(e)}} type="text" className="form-control" placeholder={this.props.user_name + ": Type Message"} />
                    <div className="input-group-append">
                        <button disabled={this.state.message===""} onClick={(e)=>this.sendMessage(e)} className="btn btn-secondary" type="button">Send</button>
                    </div>
                </div>
            </div>

        </div>
    }

}