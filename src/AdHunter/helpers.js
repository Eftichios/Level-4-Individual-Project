class Logger{
  _construct_msg = (level, message, user, ad_img, categories) =>{
      return {date: new Date(), level: level, msg: message, user: user, ad_img: ad_img, categories: categories}
  }

  log = (level, message, user, ad_img=null, categories=null) =>{
      var msg_data = this._construct_msg(level, message, user, ad_img, categories);
      fetch("http://localhost:5000/api/logger", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({msg_data: msg_data, from: "extension" })
      });
  }
}

const logger = new Logger()

// gets the users id from their user name
getUserIdFromName = async (user_name) => {
    console.log(user_name);
    try{
        const response = await fetch("http://localhost:5000/api/users/name", {
          method: "POST",
          headers: 
          {"Content-Type": "application/json"},
          body: JSON.stringify({"user_name":user_name})
        });
  
        const parseRes = await response.json();  
        return parseRes.user_id;

      } catch (err){
        console.error(err.message);
        return null;
      } 
}

// extracts domain out of a url
extractDomain = (url)=>{
  if (!url){
    return null
  }
  var match = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  var domain = match && match[1];

  return domain
}