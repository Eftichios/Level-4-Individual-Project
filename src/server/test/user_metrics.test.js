const app = require("../express/app")
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("User metrics API", ()=>{
    let token
    before("Get a token", async ()=>{
        const name = "user_1"
        const pass = "123"
        const response = await chai.request(app)
                                   .post("/api/auth/login")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: pass});
        
        token = response.body.token
    })

    it("It should return user metrics for all users", async ()=>{
        const response = await chai.request(app).get("/api/userMetrics/");
        response.should.have.status(200)
        response.body.length.should.not.equal(0)
    })

    it("It should return user metrics for user_1 for search_query='user_1'", async ()=>{
        const user = "user_1"
        const response = await chai.request(app)
                                   .post("/api/userMetrics/search")
                                   .set('content-type', 'application/json')
                                   .set('token', token)
                                   .send({user:user});
        response.should.have.status(200)
        response.body[0].user_metric.user_id.should.equal(1)
    })

    it("It should return null for search_query='does not exist'", async ()=>{
        const user = "does not exist"
        const response = await chai.request(app)
                                   .post("/api/userMetrics/search")
                                   .set('content-type', 'application/json')
                                   .set('token', token)
                                   .send({user:user});
        
        response.should.have.status(404)

    })
});