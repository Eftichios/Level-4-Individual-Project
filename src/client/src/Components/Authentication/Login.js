import React from 'react';
import { Link } from 'react-router-dom';
import "../../index.css";
import "../../App.css"
import {toast} from 'react-toastify';

export class Login extends React.Component {

    constructor(props){
        super(props);
        this.setAuth = props.setAuth;

        this.state = {
          name: "",
          password: "",
        }

        this.onChange = e => {
          this.setState({[e.target.name]: e.target.value});
        };

        this.onSubmitForm = async (e) => {
          e.preventDefault();
          
          try {
            const response = await fetch("http://localhost:5000/auth/login", {
              method:"POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({"name": this.state.name, "password": this.state.password})
            });

            const parseRes = await response.json();

            if (parseRes.token){
              localStorage.setItem("token", parseRes.token);
              this.setAuth(true);
              toast.success("Logged in succesfully.");
            }else {
              this.setAuth(false);
              toast.error(parseRes);
            }
            

          } catch (err){
            console.error(err.message)
          }
          
        }

    }

    render(){
        return <div className="pb-2 container">
        <div className="row h-100 justify-content-center align-items-center">
        <h3>Login</h3>
          <form className="col-12" onSubmit={this.onSubmitForm}>
            <div className="form-group">
              <label htmlFor="usernameInput">Username</label>
              <input name="name" type="text" className="form-control" id="usernameInput" placeholder="Username" value={this.state.name} onChange={(e)=>this.onChange(e)}/>
            </div>
            <div className="form-group">
              <label htmlFor="passwordInput">Password</label>
              <input name="password" type="password" className="form-control" id="passwordInput" placeholder="Password" value={this.state.password} onChange={(e)=>this.onChange(e)} />
            </div>
            <div className="text-center">
              <button value="submit" className="constSize btn btn-primary">Login</button>
              <Link to="/register"><button className="constSize btn orange">Register</button></Link>
            </div>
          </form>   
        </div>
      </div>
    }
}

export default Login;