import React from "react";
import './App.css';
import {Register} from './Components/Authentication/Register';
import {Login} from './Components/Authentication/Login';
import {Route, Switch } from 'react-router-dom';
import Navigation from "./Components/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard"

function App() {
  
  return (
    <div className="row">
      <div className="col-md-2">
      <Navigation />
      </div>
      <div className="col-md-8 mt-4 card">
      <div className="card-body">
      <main>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </main>
      </div>
      </div>
    </div>
  );
}

export default App;
