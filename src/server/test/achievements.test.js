const app = require("../express/app")
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("Achievements API", ()=>{
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

    it("It should return all achievements", async ()=>{
        const response = await chai.request(app).get("/api/achievements");
        response.should.have.status(200)
        response.body.length.should.not.equal(0)
            
    })

    it("It should return the achievement with id=1", async ()=>{
        const achievement_id = 1
        const response = await chai.request(app).get("/api/achievements/" + achievement_id)
        response.should.have.status(200);
        response.body.achievement_id.should.be.eq(1);           
    });

    it("It should return no achievement with id=45", async ()=>{
        const achievement_id = 45
        const response = await chai.request(app).get("/api/achievements/" + achievement_id)
        response.should.have.status(404);
        response.body.should.be.eq('No achievement exists with the given id.');           
    });

    it("It should remove the achievement with id=1", async ()=>{
        const achievement_id = 1
        const response = await chai.request(app)
                                   .delete("/api/achievements/" + achievement_id)
                                   .set("token", token)
        response.should.have.status(200);         
    });
});