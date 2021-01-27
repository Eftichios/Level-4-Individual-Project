import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import "./about.css";

export class InfoModal extends React.Component {
    
    constructor(props){
        super(props);

        this.who = props.who;
        this.title = props.title;
        this.text = props.text;
    }

    render(){
        return <div>
        {this.props.button?<button className="constSize btn btn-info" data-toggle="modal" data-target={"#"+this.who}>How to Play</button>:<FontAwesomeIcon className="text-primary detail-hover" data-toggle="modal" data-target={"#"+this.who} icon={faQuestionCircle}/>}
        <div className="modal fade" id={this.who} tabIndex="-1" role="dialog" aria-labelledby="infoLabel" aria-hidden="true">
        <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id={this.who}>{this.title}</h5>
                <button type="button" className="close" data-toggle="modal" data-target={"#"+this.who} aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
                <div className="modal-body info-body">
                    <div>{this.text}</div>
                </div>
                <div className="modal-footer">    
                    <button type="button" className="btn btn-secondary" data-toggle="modal" data-target={"#"+this.who}>Close</button>
                </div>
            </div>
        </div>
        </div>
    </div>
    }
}

export default InfoModal;