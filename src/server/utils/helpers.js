function getIdParam(req){
    const id = parseInt(req.params.id);

    if (isNaN(id)){
        throw new TypeError(`Invalid ':id' param: "${id}". It should be of type integer.`)
    }
    return id;
}

module.exports = { getIdParam }