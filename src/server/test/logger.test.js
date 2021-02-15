const app = require("../express/app")
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("Logger API", ()=>{
    it("It should store a log entry in the database", async ()=>{
        const response = await chai.request(app)
                                   .post("/api/logger")
                                   .set('content-type', 'application/json')
                                   .send({from: "client", msg_data: {
                                                            date: new Date(), level:"test", msg:"Testing route", user:"test_user"}});;
        response.should.have.status(200)
        response.body.should.equal('success')
            
    })

    it("It should have a client log entry in the database", async ()=>{
        const response = await chai.request(app)
                                   .post("/api/logger/logs")
                                   .set("content-type", 'application/json')
                                   .send({from: "client"});
        response.should.have.status(200)
        response.body.length.should.equal(1)
            
    })

    it("It should have zero extension log entries in the database", async ()=>{
        const response = await chai.request(app)
                                   .post("/api/logger/logs")
                                   .set("content-type", 'application/json')
                                   .send({from: "extension"});
        response.should.have.status(404)
        response.body.should.equal("No logs found")
            
    })
});