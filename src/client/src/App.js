import React from "react";
import './App.css';
import {Register} from './Components/Authentication/Register';
import {Login} from './Components/Authentication/Login';
import {Route, Switch } from 'react-router-dom';
import Navigation from "./Components/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard"
import Lobby from "./Components/Lobby/Lobby";

function App() {
  
  return (
    <div className="row full">
      <div className="col-md-2">
      <Navigation />
      </div>
      <div className="col-md-8 mt-4 card card-main">
      <div className="card-body">
      <main>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/lobby" component={Lobby} />
        </Switch>
      </main>
      </div>
      </div>
    </div>
  );
}

export default App;
