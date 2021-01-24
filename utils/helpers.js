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
    return ["Arts & Entertainment",
    "Automotive",
    "Business",
    "Careers",
    "Education",
    "Family & Parenting",
    "Health & Fitness",
    "Food & Drink",
    "Hobbies & Interests",
    "Home & Garden",
    "Law, Gov’t & Politics",
    "News",
    "Personal Finance",
    "Society",
    "Science",
    "Pets",
    "Sports",
    "Style & Fashion",
    "Technology & Computing",
    "Travel",
    "Real Estate",
    "Shopping",
    "Religion & Spirituality",
    "Uncategorized"];
}

module.exports = { getIdParam, getMinutesOfDates, getCategoryMap }