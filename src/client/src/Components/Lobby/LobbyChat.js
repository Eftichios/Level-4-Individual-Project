import React from 'react';
import "./lobby.css";


export class LobbyChat extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user: props.user,
            msgs: props.msgs
        }

    }

    render () {
        return <div className="card chat">
            <div className="card-body ">
                <div className="ml-1 mb-1 overflow-auto display">
                    {this.state.msgs}
                </div>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder={this.state.user + ": Type Message"} aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                        <button className="btn btn-secondary" type="button">Send</button>
                    </div>
                </div>
            </div>

        </div>
    }

}