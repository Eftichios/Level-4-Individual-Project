getUserIdFromName = async (user_name) => {
    console.log(user_name);
    try{
        const response = await fetch("http://localhost:5000/api/users/name", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({"user_name":user_name})
        });
  
        const parseRes = await response.json();  
        return parseRes.user_id;

      } catch (err){
        console.error(err.message);
        return null;
      } 
}