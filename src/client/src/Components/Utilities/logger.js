class Logger{
    _construct_msg = (level, message, user) =>{
        return {Date: new Date().toLocaleString(), level: level, msg: message, user: user}
    }

    log = (level, message, user) =>{
        var msg_data = this._construct_msg(level, message, user);
        fetch("http://localhost:5000/api/logger", {
            method: "POST",
            headers: {token: localStorage.token, "Content-Type": "application/json"},
            body: JSON.stringify(msg_data)
        });
    }
}

const logger = new Logger()

export default logger