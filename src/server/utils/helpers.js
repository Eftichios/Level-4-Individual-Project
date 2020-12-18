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

module.exports = { getIdParam, getMinutesOfDates }