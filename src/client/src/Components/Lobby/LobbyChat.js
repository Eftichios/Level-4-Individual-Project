import React from 'react';
import "./lobby.css";


export class LobbyChat extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user: props.user
        }

        class Messages {
            
            constructor(player, msg, date  ){

                this.player = player;
                this.msg = msg;
                this.date = date;
            }
        }

        this.msgs_data = [new Messages("George","Hey everyone!", new Date()), 
                    new Messages("Jacob","Hello!", new Date()), 
                    new Messages("Larry","Yoo, have fun guys!", new Date()), 
                    new Messages("George","Thanks man, you too!", new Date()), 
                    new Messages("Jacob","Good luck :)", new Date())]
        
        this.msgs = this.msgs_data.map((msg)=><p><small>{msg.date.toLocaleTimeString()} </small>{msg.msg} - <strong>{msg.player}</strong> </p>)
    }

    render () {
        return <div className="card chat">
            <div className="card-body ">
                <div className="mb-1 overflow-auto display">
                    {this.msgs}
                    </div>
                <div className="row">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder={this.state.user + ": Type Message"} aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                        <button className="btn btn-secondary" type="button">Send</button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    }

}