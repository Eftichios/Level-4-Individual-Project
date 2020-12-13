const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');


async function getAll(req, res) {
    const organisations = await models.organisation.findAll();
    res.status(200).json(organisations);
}

async function getById(req, res) {
    const organisation_id = getIdParam(req);
    const organisation = await models.organisation.findByPk(organisation_id);
    if (organisation){
        res.status(200).json(organisation);
    } else {
        res.status(404).json('No organisation exists with the given id.');
    }
}

async function getByName(req, res) {
    const organisation = await models.organisation.findOne({where: {organisation_name: req.body.organisation_name}})
    if (organisation){
        res.status(200).json(organisation);
    } else {
        res.status(404).json('No organisation exists with the given name.');
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    
    await models.organisation.destroy({
        where: {
            organisation_id:id
        }
    });
    res.status(200).json("Organisation deleted succesfully.")
}

module.exports = {
    getAll,
    getById,
    getByName,
    remove
}