import React, {useState, useEffect} from "react";
import './App.css';
import {Register} from './Components/Authentication/Register';
import {Login} from './Components/Authentication/Login';
import {BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Navigation from "./Components/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard"
import Lobby from "./Components/Lobby/Lobby";
import Summary from "./Components/Summary/Summary";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (token_exists) => {
    setIsAuthenticated(token_exists);
  };

  async function isAuth(){
    try{

      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json();

      parseRes === true? setIsAuthenticated(true): setIsAuthenticated(false);

    } catch (err){
      console.error(err.message);
    }
  }

  useEffect(()=>{
    isAuth();
  })

  return (
    <div className="row full">
      <div className="col-md-2">
      <Navigation />
      </div>
      <div className="col-md-8 mt-4 card card-main">
      <div className="card-body">
      <Router>
        <Switch>
          <Route path="/register" render={props => !isAuthenticated? <Register {...props} setAuth={setAuth} />:
            <Redirect to="/login" />} />
          <Route path="/login" render={props => !isAuthenticated? <Login {...props} setAuth={setAuth} /> : 
            <Redirect to="/dashboard" />} />
          <Route path="/dashboard" render={props => isAuthenticated? <Dashboard {...props} setAuth={setAuth} />:
            <Redirect to="/login" />} />
          <Route path="/lobby" render={props => isAuthenticated? <Lobby {...props} setAuth={setAuth} />:
            <Redirect to="/login"/>} />
          <Route path="/summary" render={props => isAuthenticated? <Summary {...props} setAuth={setAuth} />:
            <Redirect to="/login" />} />
        </Switch>
      </Router>
      </div>
      </div>
    </div>
  );
}

export default App;
