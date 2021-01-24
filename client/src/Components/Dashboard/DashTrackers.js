import React from 'react';
import "./dashboard.css";
import tracker_data from '../Utilities/trackerDataInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export class DashTrackers extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            trackers: null,
            showAll: true,
            tracker_info: null,
            modal_title: "Trackers",
            current_page: 0,
            max_pages: 1,
            current_tab: true,
            count: "loading..."
        }

        this.trackers_per_page = 500;
    }

    buildTrackers(page_index, reset_index=false){
        if (reset_index){
            this.setState({current_page: 0});
        }
        var tracker_list = this.props.user_metrics.tracker_list
        var refined = []
        var list_start = page_index * this.trackers_per_page;
        var filtered_list = Object.entries(tracker_list).filter(((key)=>key[1]["found"]===this.state.current_tab)).sort((a,b)=>b[1]["extra_info"]-a[1]["extra_info"]);
        filtered_list.slice(list_start,list_start+this.trackers_per_page).forEach(([key,value])=>{
            if (tracker_data.hasOwnProperty(key)){
                refined.push({"tracker": key, "name": tracker_data[key]["name"], "location": tracker_data[key]["country"], "domain": tracker_data[key]["domain"], "extra_info": true, "found": value["found"]})
            } else {
                refined.push({"tracker": key, "name": "Unknown", "location": "Unknown", "domain": "Unknown", "extra_info": false, "found": value["found"]})
            }
        });
        var tracker_els = refined.sort((a,b)=>b["extra_info"]-a["extra_info"]).map((tracker,index)=>
            <div key={index} className="col-md-6 text-left">
                <span className={tracker["found"]===true?"text-success tracker_item":"text-secondary tracker_item"}>{list_start+index+1 +". "+tracker["tracker"]}</span>
                {tracker["extra_info"]?<FontAwesomeIcon onClick={()=>this.toggleTrackerData(tracker)} title="Extra Info" className="ml-2 detail-hover text-primary" icon={faInfoCircle} />:<FontAwesomeIcon title="No additional info available" className="ml-2 text-secondary" icon={faInfoCircle} />}   
            </div>
        );
        this.setState({max_pages: filtered_list.length / this.trackers_per_page});
        this.setState({count: this.state.current_tab?`Found: ${filtered_list.length}`:`Not Found: ${filtered_list.length}`})
        this.setState({trackers: tracker_els})
    }

    toggleTrackerData(tracker){
        var temp_tracker_info = <div className="text-center"key={tracker["name"]}>
            <div className="row form-group">
                <label className="col-md-4" htmlFor="difficulty">Tracker: </label>
                <input className="col-md-7" id="difficulty" disabled value={tracker["tracker"]} />
            </div>
            <div className="row form-group">
                <label className="col-md-4" htmlFor="status">Name: </label>
                <input className="col-md-7" id="status" disabled value={tracker["name"]} />
            </div>
            <div className="row form-group">
                <label className="col-md-4" htmlFor="game_mode">Location: </label>
                <input className='col-md-7' id="game_mode" disabled value={tracker["location"]} />
            </div>
            <div className="row form-group">
                <label className="col-md-4" htmlFor="description">Domain: </label>
                <input type='text-area' className='col-md-7' id="description" disabled value={tracker["domain"]} />
            </div>
        </div>

        this.setState({modal_title: "Tracker Info",tracker_info: temp_tracker_info, showAll: false})
    }

    resetModalData(){
        this.setState({modal_title: "Trackers", showAll: true});
    }

    async advance_page(amount){
        if (amount===-1 && this.state.current_page > 0){
            await this.setState({current_page: this.state.current_page-1})
            this.buildTrackers(this.state.current_page);
            
        }else if (amount===1 && this.state.current_page < this.state.max_pages-1){
            await this.setState({current_page: this.state.current_page+1})
            this.buildTrackers(this.state.current_page);
        }
    }

    async switch_tab(owned){
        await this.setState({current_tab: owned})
        this.buildTrackers(0, true);
    }

    render(){
        return  <div>
                <h3>Trackers</h3>
                <div><button disabled={this.props.user_metrics===null} onClick={()=>this.buildTrackers(0, true)}className="mb-1 constSize btn btn-sm btn-primary" data-toggle="modal" data-target="#trackers">View Trackers</button></div>
                <div className="modal fade" id="trackers" tabIndex="-1" role="dialog" aria-labelledby="trackersLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="trackers">{this.state.modal_title}</h5>
                        <div className="page_switch text-center">
                            <button className={this.state.current_tab?"btn btn-primary":"btn btn-secondary"} onClick={()=>this.switch_tab(true)}>Found</button>
                            <button className={this.state.current_tab===false?"btn btn-primary":"btn btn-secondary"} onClick={()=>this.switch_tab(false)}>Not Found</button>
                        </div>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <div className="modal-body">
                            <h5 className="text-center">{this.state.count}</h5>
                            <hr></hr>
                            <div className="row">
                            {this.state.showAll?this.state.trackers:this.state.tracker_info}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="page_switch text-center">
                                <FontAwesomeIcon onClick={()=>this.advance_page(-1)} title="Extra Info" className="ml-2 detail-hover text-primary" icon={faChevronLeft} />
                                <strong className="p-2 m-2">{this.state.current_page + 1}</strong>
                                <FontAwesomeIcon onClick={()=>this.advance_page(1)} title="Extra Info" className="ml-2 detail-hover text-primary" icon={faChevronRight} />
                            </div>
                            {this.state.showAll?<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>:<button onClick={()=>this.resetModalData()} type="button" className="btn btn-secondary">Back</button>}
                        </div>
                    </div>
                </div>
                </div>
            </div>
    }

}

export default DashTrackers