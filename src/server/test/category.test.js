const app = require("../express/app")
const {getMinutesOfDates, getCategoryMap} = require('../utils/helpers');
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("Category mode API", ()=>{
    // it("It should return Sports", async ()=>{
    //     const url = "www.joindota.com"
    //     const response = await chai.request(app)
    //                                .post("/api/category")
    //                                .set('content-type', 'application/json')
    //                                .send({ad_url: url});
    //     response.should.have.status(200)
    //     response.body.length.should.equal(1)
    //     response.body[0].should.equal("Sports")
            
    // }) ** Relies on external service (the web categorisation API used by the server to categorise ads)

    it("It should return No Category", async ()=>{
        const url = "not-a-valid-url"
        const response = await chai.request(app)
                                   .post("/api/category")
                                   .set('content-type', 'application/json')
                                   .send({ad_url: url});
        response.should.have.status(200)
        response.body.length.should.equal(1)
        response.body[0].should.equal("No Category")
            
    })
});