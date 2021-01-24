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
import Navigation from "./Components/Navigation/Navigation";

toast.configure();

export class App extends React.Component {
  
  constructor(props){
    super(props);
    
    this.state = {
      isAuthenticated: true,
      isLoading: true,
      user_id: null
    }
    
    this.setAuth = (token_exists) => {
      this.setState({isAuthenticated: token_exists});
    };

    this.setUserId = (u_id) => {
      this.setState({user_id: u_id});
    }
  }

  componentDidMount() {
    this.isAuth();
  }

  // check if a user is authenticated
  isAuth = async () => {
    try{
      const response = await fetch("/api/auth/isVerified", {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json();  
      this.setUserId(parseRes.user_id);
      parseRes.success===true? this.setState({isAuthenticated:true}) : this.setState({isAuthenticated:false});
      
    } catch (err){
      toast.error("Failed to authenticate user. Please try re-logging");
    } finally {
      this.setState({isLoading: false})
    }
  }

  render(){
    if (this.state.isLoading) {

      return <Loader className="loader-middle" type="Oval" color="#F89603" height={80} width={80}/>
    }

    return (
        <div className="d-flex">
          <div className="container-fluid">
          <input type="hidden" autoFocus={true} /> {/* Put this here to remove autofocus */}
          <Router>
          
            <Switch>
              <Route path="/register" render={props => !this.state.isAuthenticated? <Register  {...props} setUserId={this.setUserId} setAuth={this.setAuth}/>:<Redirect to="/login" />} />
              <Route path="/login" render={props => !this.state.isAuthenticated? <Login {...props} setUserId={this.setUserId} setAuth={this.setAuth} /> : <Redirect to="/dashboard" />} />
              <Route path="/dashboard" render={props => this.state.isAuthenticated? <><Navigation  /><Dashboard {...props} setAuth={this.setAuth} user_id={this.state.user_id} /></>:<Redirect to="/login" />} />
              <Route path="/lobby" render={props => this.state.isAuthenticated? <><Navigation  /><Lobby {...props} setAuth={this.setAuth} user_id={this.state.user_id} /></>:<Redirect to="/login"/>} />
              <Route path="/summary" render={props => this.state.isAuthenticated? <><Navigation  /><Summary {...props} setAuth={this.setAuth} user_id={this.state.user_id} /></>:<Redirect to="/login" />} />
              <Route path="/test" render={props => this.state.isAuthenticated? <h3>AUTHENTICATED</h3>:<h3>NOT AUTHENTICATED</h3>} />
              <Route path="/" exact render={props => <Redirect to="/dashboard" />} />
            </Switch>
          </Router>
          </div>
        </div>
    );
  }
}

export default App;
