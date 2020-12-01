import React from 'react';
import "../../index.css";
import "./dashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export class DashAchieve extends React.Component {

    constructor(props){
        super(props);

        this.state = props;
    }

    render(){
        return <div className="d-flex flex-column align-items-center">
        <h3>Achievements</h3>
        <table className="table text-center not-full">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Difficulty</th>
                    <th scope="col">Title</th>
                    <th scope="col">Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td><FontAwesomeIcon className="text-primary" icon={faInfoCircle} /></td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td><FontAwesomeIcon className="text-primary" icon={faInfoCircle} /></td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td><FontAwesomeIcon className="text-primary" icon={faInfoCircle} /></td>
                </tr>
                <tr>
                    <th scope="row">4</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td><FontAwesomeIcon className="text-primary" icon={faInfoCircle} /></td>
                </tr>
                <tr>
                    <th scope="row">5</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td><FontAwesomeIcon className="text-primary" icon={faInfoCircle} /></td>
                </tr>
            </tbody>
        </table>
        </div>
    }

}

export default DashAchieve;