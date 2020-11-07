import React from "react";
import './App.css';
import {Register} from './Components/Authentication/Register';
import {Login} from './Components/Authentication/Login';
import {Route, Switch } from 'react-router-dom';
import Navigation from "./Components/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard"

function App() {
  
  return (
    <div>
      <Navigation />
      <main>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
