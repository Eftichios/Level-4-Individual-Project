import { FaBars } from 'react-icons/fa';
import { BiArrowBack } from 'react-icons/bi'
import { IconContext } from 'react-icons';
import React from 'react';
import {Link } from 'react-router-dom';
import { sidebar_data } from './sidebar_link_data';
import './navigation.css';

export class Navigation extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            show_sidebar: false
        }

        this.links = sidebar_data.map((link, index) =>{
            return (<li key={index} className={link.cName}>
                <Link to={link.path}>
                    {link.icon}
                    <span>{link.title}</span>
                </Link>
            </li>)
        });


    }

    toggleSidebar = () => {
        this.setState({show_sidebar: !this.state.show_sidebar})
    }

    render(){
        return <div>
            <IconContext.Provider value={{ color: '#fff' }}>
            <div>
                <div className='menu-bars'>
                    <FaBars className="toggle-button" color='#007bff' onClick={()=>this.toggleSidebar()} />
                </div>
            </div>
            <nav className={this.state.show_sidebar? 'nav-menu active':'nav-menu'}>
                <ul className='nav-menu-items' onClick={()=>this.toggleSidebar()}>
                    <li className='float-right navbar-toggle'>
                        <div className='menu-bars-x'>
                            <BiArrowBack className="toggle-button" />
                        </div>
                    </li>
                    {this.links}
                </ul>
            </nav>
            </IconContext.Provider>
        </div>
    }
}

export default Navigation;