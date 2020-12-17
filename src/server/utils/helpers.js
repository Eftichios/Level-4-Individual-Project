function getIdParam(req){
    const id = parseInt(req.params.id);

    if (isNaN(id)){
        throw new TypeError(`Invalid ':id' param: "${id}". It should be of type integer.`)
    }
    return id;
}

function getMinutesOfDates(startDateStr, endDateStr){
    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);
    return Math.ceil(endDate.getMinutes() - startDate.getMinutes());
}

module.exports = { getIdParam, getMinutesOfDates }