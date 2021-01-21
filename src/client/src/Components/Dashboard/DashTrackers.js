import React from 'react';
import "./dashboard.css";

export class DashTrackers extends React.Component {

    render(){
        return  <div>
                <h3>Trackers</h3>
                <div><button className="mb-1 constSize btn btn-sm btn-primary" data-toggle="modal" data-target="#trackers">View Trackers</button></div>
                <div className="modal fade" id="trackers" tabIndex="-1" role="dialog" aria-labelledby="trackersLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="trackers">Trackers</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <div className="modal-body">
                            <div className="row">
                            {this.props.trackers}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
    }

}

export default DashTrackers