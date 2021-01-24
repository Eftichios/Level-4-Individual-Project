const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');

async function getById(req, res) {
    const id = getIdParam(req);
    const user_organisations = await models.user_organisation.findAll({where: {user_id: id}});
    if (user_organisations){
        res.status(200).json(user_organisations);
    } else {
        res.status(404).json('No organisations found for the user with the given id.');
    }
}

async function update(req, res) {
    const user_id = getIdParam(req); 

    const organisation_id = req.body.organisation_id;
    const organisation_to_update = await models.user_organisation.findOne({where: {user_id: user_id, organisation_id: organisation_id}});
    var date_found_first = organisation_to_update.date_found_first? organisation_to_update.date_found_first : new Date();
    var times_found = organisation_to_update.times_found + 1;
    var url = req.body.url_found;
    var acquired_from = req.body.acquired_from;
    const organisation = await models.user_organisation.update({
        date_found_first: date_found_first, times_found: times_found, found_url: url, acquired_from: acquired_from}, 
        {where: {organisation_id: organisation_id, user_id: user_id}});

    if (organisation){
        res.status(200).json("Organisation updated succesfully");
    } else {
        res.status(404).json('No organisation found for the given user id and achievements id.');
    }

}

module.exports = {
    getById,
    update
}