import React from "react";
import './App.css';
import {Register} from './Components/Authentication/Register';
import {Login} from './Components/Authentication/Login';
import {BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from "./Components/Dashboard/Dashboard"
import Lobby from "./Components/Lobby/Lobby";
import Summary from "./Components/Summary/Summary";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner'

toast.configure();

export class App extends React.Component {
  
  constructor(props){
    super(props);
    
    this.state = {
      isAuthenticated: true,
      isLoading: true
    }
    
    this.setAuth = (token_exists) => {
      this.setState({isAuthenticated: token_exists});
    };
  }

  componentDidMount() {
    this.isAuth();
  }

  isAuth = async () => {
    try{
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json();
      parseRes===true? this.setState({isAuthenticated:true}) : this.setState({isAuthenticated:false});
      this.setState({isLoading: false});
      
    } catch (err){
      this.setState({isLoading: false});
      console.error(err.message);
    }
  }

  render(){
    if (this.state.isLoading) {

      return <Loader className="loader-middle" type="Oval" color="#F89603" height={80} width={80}/>
    }

    return (
      <div className="d-flex justify-content-center">
        <div className="mt-4 card card-main">
        <div className="card-body">
        <input type="hidden" autofocus={true} /> {/* Put this here to remove autofocus */}
        <Router>
          <Switch>
            <Route path="/register" render={props => !this.state.isAuthenticated? <Register {...props} setAuth={this.setAuth} />:<Redirect to="/login" />} />
            <Route path="/login" render={props => !this.state.isAuthenticated? <Login {...props} setAuth={this.setAuth} /> : <Redirect to="/dashboard" />} />
            <Route path="/dashboard" render={props => this.state.isAuthenticated? <Dashboard {...props} setAuth={this.setAuth} />:<Redirect to="/login" />} />
            <Route path="/lobby" render={props => this.state.isAuthenticated? <Lobby {...props} setAuth={this.setAuth} />:<Redirect to="/login"/>} />
            <Route path="/summary" render={props => this.state.isAuthenticated? <Summary {...props} setAuth={this.setAuth} />:<Redirect to="/login" />} />
            <Route path="/test" render={props => this.state.isAuthenticated? <h3>AUTHENTICATED</h3>:<h3>NOT AUTHENTICATED</h3>} />
          </Switch>
        </Router>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
