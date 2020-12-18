import React from 'react';
import "../../index.css";
import "./dashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export class DashAchieve extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            user: "George",
            modalContent: {}
        }

        class Achievement{
            constructor(id, difficulty, title, game_mode, description, status){
                this.id = id;
                this.difficulty = difficulty;
                this.title = title;
                this.game_mode = game_mode;
                this.achievement_description = description;
                this.status = status;              
            }
        }

        this.mapStatusColour = {'Completed':'text-success', 'In Progress': 'text-warning', 'Not Started':'text-danger'}

        this.achievement_data = [new Achievement(1, 'Easy', 'Fastest man alive I', 
                                    'Race', 'Play 1 race game.', 'Completed'),
                                new Achievement(2, 'Easy', 'Fastest man alive II', 
                                    'Race', 'Play 5 race games.', 'In Progress'),
                                new Achievement(3, 'Easy', 'Fastest man alive III', 
                                    'Race', 'Play 10 race games.', 'In Progress'),
                                new Achievement(4, 'Medium', 'Fastest man alive IV', 
                                    'Race', 'Play 25 race games.', 'Completed'),
                                new Achievement(5, 'Hard', 'Hide and seek I', 
                                    'Hunting', 'Find 5 rare organisations', 'Not Started')
                                ]
        this.achievements = this.achievement_data.map((ac) => <tr key={ac.id}>
            <th>{ac.id}</th>
            <td>{ac.difficulty}</td>
            <td>{ac.title}</td>
            <td><FontAwesomeIcon onClick={()=>this.setModalContent(ac)} data-toggle="modal" data-target="#achievementModal" className="detail-hover text-primary" icon={faInfoCircle} /></td>
            <th className={this.mapStatusColour[ac.status]}>{ac.status}</th>
        </tr>)
    }

    setModalContent(achievement){
        this.setState({modalContent: achievement})
    }

    render(){
        return <div className="d-flex flex-column align-items-center">
        <h3>Achievements</h3>
        <div className="table-responsive achieve-scrollbar">
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Difficulty</th>
                        <th scope="col">Title</th>
                        <th scope="col">Details</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {this.achievements}
                </tbody>
            </table>
        </div>
            <div className="modal fade" id="achievementModal" tabIndex="-1" role="dialog" aria-labelledby="achievementLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="achievementLabel">{this.state.modalContent.title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="row form-group">
                        <label className="col-md-4" htmlFor="difficulty">Difficulty: </label>
                        <input className="col-md-7" id="difficulty" disabled value={this.state.modalContent.difficulty} />
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" htmlFor="status">Status: </label>
                        <input className={`${this.mapStatusColour[this.state.modalContent.status]} col-md-7`} id="status" disabled value={this.state.modalContent.status} />
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" htmlFor="game_mode">Game Mode: </label>
                        <input className='col-md-7' id="game_mode" disabled value={this.state.modalContent.game_mode} />
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" htmlFor="description">Description: </label>
                        <input type='text-area' className='col-md-7' id="description" disabled value={this.state.modalContent.achievement_description} />
                    </div>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        </div>
    }

}

export default DashAchieve;