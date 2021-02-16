class Logger{
    _construct_msg = (level, message, user) =>{
        return {date: new Date(), level: level, msg: message, user: user}
    }

    log = (level, message, user) =>{
        var msg_data = this._construct_msg(level, message, user);
        fetch("/api/logger", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({msg_data: msg_data, from: "client" })
        });
    }
}

const logger = new Logger()

export default logger