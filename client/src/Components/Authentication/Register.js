import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../index.css"

export class Register extends React.Component {

    constructor(props){
        super(props);

        this.state = {
          name: "",
          password: "",
          confirm_password: "",
          owns_plugin: "true",
          loading: false
        }
        
        this.setAuth = props.setAuth;
        this.setUserId = props.setUserId;
        this.setOwnsPlugin = props.setOwnsPlugin;
    }

    onChange = e => {
      this.setState({[e.target.name]: e.target.value});
    };

    onSubmitForm = async (e) => {
      e.preventDefault();
      
      try {
        this.setState({loading: true});
        const response = await fetch("/api/auth/register", {
          method:"POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({"user_name": this.state.name, "password": this.state.password, "confirm_password": this.state.confirm_password, "owns_plugin": this.state.owns_plugin})
        });

        const parseRes = await response.json();
        
        this.setState({loading: false});
        if (parseRes.token){
          localStorage.setItem("token", parseRes.token);
          this.setOwnsPlugin(this.state.owns_plugin==="true"?true:false);
          this.setUserId(parseRes.user_id);
          this.setAuth(true)
          toast.success("Registered succesfully!")
        } else {
          this.setAuth(false)
          toast.error(parseRes);
        }



      } catch (err){
        console.error(err.message)
      }
      
    }

    render(){
        return <div className="mt-4 pb-2 container">
        <div className="row justify-content-center align-items-center">
        <h3>Register for an account</h3>
          <form className="col-12" onSubmit={this.onSubmitForm}>
            <div className="form-group">
              <label htmlFor="usernameInput">Username</label>
              <input name="name" type="text" className="form-control" id="usernameInput" placeholder="Username" value={this.state.name} onChange={(e)=>this.onChange(e)} />
            </div>
            <div className="form-group">
              <label htmlFor="passwordInput">Password</label>
              <input name="password" type="password" className="form-control" id="passwordInput" placeholder="Password" value={this.state.password} onChange={(e)=>this.onChange(e)} />
            </div>
            <div className="form-group">
              <label htmlFor="passwordInputConfirm">Confirm password</label>
              <input name="confirm_password" type="password" className="form-control" id="passwordInputConfirm" placeholder="Confirm Password" value={this.state.confirm_password} onChange={(e)=>this.onChange(e)} />
            </div>
            <div className="form-group">
              <label htmlFor="ownsPluginInput">Do you have the chrome extension installed?</label>
              <select className="form-control" name="owns_plugin" id="ownsPluginInput" onChange={(e)=>this.onChange(e)}>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
            <div className="text-center">
            <button disabled = {this.state.loading} value="submit" className="constSize btn btn-primary">{this.state.loading?"Registering...":"Register"}</button>
              <Link to="/login"><button className="constSize btn orange">Login</button></Link>
            </div>
          </form>   
        </div>
      </div>
    }
}

export default Register;