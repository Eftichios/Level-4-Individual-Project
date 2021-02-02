const { models } = require('../../sequelize');
var url_parser = require('url');
var sa = require('superagent');

search_in_database = async(url)=>{
    var ad_entry = await models.ad_category.findOne({where: {ad_url: url}});
    if (ad_entry){
        return ad_entry.categories;
    }else{
        return null
    }
}

store_in_database = async(url, categories)=>{
    await models.ad_category.create({"ad_url":url,"categories":categories})
}


var extract_domain = (url) => {
    return url_parser.parse(url).hostname || url
}

async function queryCategories(url){
    var categories = await search_in_database(url);
    if (categories){
        return categories;
    }

    // make api request
    try{
        var res = await sa.get(`https://website-categorization.whoisxmlapi.com/api/v1?apiKey=at_ur6J5OfOyx7VU1A1SAeKlgwKFA7zx&domainName=${url}`)
        console.log(res.body.categories);
        if (res.body.categories.length > 0){
            categories = res.body.categories;
        } else {
            categories = ["No Category"];
        }
        await store_in_database(url, categories);
        return categories;
    } catch (err){
        console.log(err.message, url)
        return ["No Category"];
    }

}

async function category(req, res){
    var ad_url = extract_domain(req.body.ad_url);
    if (ad_url.length < 250){
        var categories = await queryCategories(ad_url);
        res.status(200).json(categories);
    }else{
        res.status(200).json(["No Category"]);
    }
    
    
}

module.exports = {category}