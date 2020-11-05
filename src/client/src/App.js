import React, {useState} from "react";
import './App.css';

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
    <div><button className="btn btn-success mt-2" onClick={getMessage}>Submit</button><p>{descr}</p></div>
  );
}

export default App;
