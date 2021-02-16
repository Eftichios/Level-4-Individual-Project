const AchievementManager = require("../utils/AchievementManager")
const app = require("../express/app")
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("Achievement manager tests", ()=>{
    let achievement_manager
    let token
    before("Initialise metrics handler and get a token", async ()=>{
        achievement_manager = new AchievementManager()
        const name = "user_1"
        const pass = "123"
        const response = await chai.request(app)
                                   .post("/api/auth/login")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: pass});
        
        token = response.body.token
    })

    it("It should return updated achievements for user_1", async ()=>{
        const user_id = 1
        const response = await chai.request(app).get("/api/userAchievements/" + user_id);
        response.should.have.status(200)
        response.body[0].achievement_id.should.be.eq(2)
        response.body[0].user_achievement.progress.should.be.eq(1)
    })   
});
