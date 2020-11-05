import React, {useState} from "react";
import './App.css';
import {Register} from './Components/Authentication/Register';
import {Route, Switch, Link } from 'react-router-dom';
import Navigation from "./Components/Navigation";

function App() {
  
  const [descr, setDescr] = useState("Click the button to get message.");
  const getMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/index");
      setDescr(await response.text());
    } catch (err){
      console.log(err)
    }
  }
  
  return (
    <div>
      <Navigation />
      <main>
        <Switch>
          <Route path="/register" component={Register} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
