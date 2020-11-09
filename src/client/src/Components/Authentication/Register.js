import React from 'react';
import "../../index.css"

export class Register extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return <div className="pb-2 container">
        <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
        <h3>Register for an account</h3>
          <form className="col-12">
            <div className="form-group">
              <label htmlFor="usernameInput">Username</label>
              <input type="text" className="form-control" id="usernameInput" placeholder="Username" />
            </div>
            <div className="form-group">
              <label htmlFor="passwordInput">Password</label>
              <input type="text" className="form-control" id="passwordInput" placeholder="Password" />
            </div>
            <div className="form-group">
              <label htmlFor="passwordInputConfirm">Confirm password</label>
              <input type="text" className="form-control" id="passwordInputConfirm" placeholder="Confirm Password" />
            </div>
            <div class="text-center">
            <button className="constSize btn btn-primary">Register</button>
            <button className="constSize btn orange ml-2">Login</button>
            </div>
          </form>   
        </div>
      </div>
      </div>
    }
}

export default Register;