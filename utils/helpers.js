// parses the id given as a request parameter
function getIdParam(req){
    const id = parseInt(req.params.id);

    if (isNaN(id)){
        throw new TypeError(`Invalid ':id' param: "${id}". It should be of type integer.`)
    }
    return id;
}

// calculates the minute difference between two dates
function getMinutesOfDates(startDateStr, endDateStr){
    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);
    return Math.ceil(endDate.getMinutes() - startDate.getMinutes());
}

function getCategoryMap(){
    return ["Arts and Entertainment",
        "Autos and Vehicles",
        "Beauty and Fitness",
        "Books and Literature",
        "Business and Industry",
        "Career and Education",
        "Computer and electronics",
        "Finance",
        "Food and Drink",
        "Gambling",
        "Games",
        "Health",
        "Home and Garden",
        "Internet and Telecom",
        "Law and Government",
        "News and Media",
        "People and Society",
        "Pets and Animals",
        "Recreation and Hobbies",
        "Reference",
        "Science",
        "Shopping",
        "Sports",
        "Travel"];
}

module.exports = { getIdParam, getMinutesOfDates, getCategoryMap }