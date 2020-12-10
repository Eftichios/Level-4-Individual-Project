
async function play(req, res){
    // send message to chrome extension only

    res.status(200).json(true);
}

async function stop(req, res){

    res.status(200).json(true);
}

module.exports = {play, stop}