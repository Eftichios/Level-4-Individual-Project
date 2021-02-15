const app = require("../express/app")
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("User achievement API", ()=>{
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

    it("It should return achievements for user with id=1", async ()=>{
        const user_id = 1
        const response = await chai.request(app).get("/api/userAchievements/" + user_id);
        response.should.have.status(200)
        response.body.length.should.not.equal(0)
    })

    it("It should check that all achievements have completed=false", async ()=>{
        const user_id = 1
        const response = await chai.request(app).get("/api/userAchievements/" + user_id);
        response.should.have.status(200)
        Object.entries(response.body).forEach(([key,value])=>{value.user_achievement.completed.should.be.eq(false)})
    })

    it("It should set achievement with id=1 to completed=true", async ()=>{
        const user_id = 1
        const response = await chai.request(app)
                                   .put("/api/userAchievements/" + user_id)
                                   .set('content-type', 'application/json')
                                   .set('token', token)
                                   .send({achievement_id:1, completed:true})
        response.should.have.status(200)
    })
});