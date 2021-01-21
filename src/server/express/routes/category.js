const { models } = require('../../sequelize');
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
var url_parser = require('url');

const {default: PQueue} = require('p-queue');
// create a new queue that handles requests one by one 
const queue = new PQueue({ concurrency: 1 });

var browser;
var page;

open_browser = async ()=>{
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.setUserAgent(randomUseragent.getRandom().toString());
}

open_browser();

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

async function queueRequests(ad_url) {
    return queue.add(() => extract_categories(ad_url));
}

var extract_domain = (url) => {
    return url_parser.parse(url).hostname || url
}

var extract_categories = async (url) => {
    var cached_categories = await search_in_database(url);
    if (cached_categories){
        return cached_categories
    }
    try {
      await page.goto("https://website-categorization.whoisxmlapi.com/api", 
      { waitUntil: ['load','domcontentloaded','networkidle0','networkidle2'] });
      
      await page.focus('input[name=search]');
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await page.keyboard.type(url)
      await page.click('button[type=submit]');
      
      await page.waitForTimeout(2000)
  
      await page.click('div[class=sweet-action-close]');
      
      
    } catch (err){
    //   console.log(err.message);
    } finally {
    //   await page.waitForSelector('div[class=categories]');
      let categories = await page.evaluate(()=> {
        var el_html_collection = document.getElementsByClassName('category'); 
        var el_array = [].slice.call(el_html_collection);
  
        let parsed = []
        for (i in el_array){
          parsed.push(el_array[i].innerText)
        }
        return parsed;
      });
      
      categories = categories.length>0?categories:["No Category"]
      await store_in_database(url, categories);
      return categories
    }
  
}

async function category(req, res){
    var ad_url = extract_domain(req.body.ad_url);
    if (ad_url.length < 250){
        var categories = await queueRequests(ad_url);
        console.log(categories)
        res.status(200).json(categories);
    }else{
        res.status(200).json(["No Category"]);
    }
    
    
}

module.exports = {category}