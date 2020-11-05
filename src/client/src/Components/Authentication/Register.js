import React from 'react';

export class Register extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return <div className="pb-2 card container">
        <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
        <h3>Register for an account</h3>
          <form className="col-12">
            <div className="form-group">
              <label for="usernameInput">Username</label>
              <input type="text" className="form-control" id="usernameInput" placeholder="Username" />
            </div>
            <div className="form-group">
              <label for="passwordInput">Password</label>
              <input type="text" className="form-control" id="passwordInput" placeholder="Password" />
            </div>
            <div className="form-group">
              <label for="passwordInputConfirm">Confirm password</label>
              <input type="text" className="form-control" id="passwordInputConfirm" placeholder="Confirm Password" />
            </div>
            <button className="btn btn-primary">Register</button>
            <button className="btn btn-secondary ml-2">Login</button>
          </form>   
        </div>
      </div>
      </div>
    }
}

export default Register;