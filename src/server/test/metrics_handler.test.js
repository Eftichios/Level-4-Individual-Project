const MetricsHandler = require("../utils/MetricsHandler")
const app = require("../express/app")
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("Metrics handler tests", ()=>{
    let metrics_handler
    let token
    before("Initialise metrics handler and get a token", async ()=>{
        metrics_handler = new MetricsHandler()
        const name = "user_1"
        const pass = "123"
        const response = await chai.request(app)
                                   .post("/api/auth/login")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: pass});
        
        token = response.body.token
    })

    it("It should update metrics for user_1 for a game of Race mode", async ()=>{
        var player_id = 1
        var player = "user_1"
        var game_state = {"score": 81, "trackers": ["tracker1", "tracker2", "tracker3", "tracker4", "tracker5"]}
        await metrics_handler.handleRaceMetrics(player_id, player, game_state, false) 
    })  

    it("It should return updated metrics for user_1 for a game of Race mode", async ()=>{
        const user_id = 1
        const response = await chai.request(app)
                                   .get("/api/userMetrics/" + user_id)
                                   .set('content-type', 'application/json')
                                   .set('token', token)
        response.should.have.status(200)
        response.body.race_games.should.equal(1)
        response.body.total_ad_trackers.should.equal(81)
    })  
});
