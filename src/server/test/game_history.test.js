const app = require("../express/app")
const {getMinutesOfDates, getCategoryMap} = require('../utils/helpers');
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("Game history API", ()=>{
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

    it("It should return game history for user with id=1", async ()=>{
        const user_id = 1
        const response = await chai.request(app).get("/api/gameHistory/" + user_id);
        response.should.have.status(200)
        response.body.length.should.not.equal(0)
            
    })

    it("It should create a new race mode game history for user with id=1", async ()=>{
        var dummy_trackers = "example_tracker"
        var player_data_race = {user_1: {page_history: {"www.example.com":{"count":20,"trackers": Array(20).fill(dummy_trackers)}, "www.another-example.com": {"count":15,"trackers": Array(15).fill(dummy_trackers)}, "www.lots-of-trackers.com": {"count":65,"trackers": Array(65).fill(dummy_trackers)}}, score: 100},
                            user_2: {page_history: {"www.example.com":{"count":15,"trackers": Array(15).fill(dummy_trackers)}, "www.another-example.com": {"count":10,"trackers": Array(10).fill(dummy_trackers)}, "www.lots-of-trackers.com": {"count":55,"trackers": Array(55).fill(dummy_trackers)}}, score: 80}}
        var startDate = new Date("2020/08/08 15:00");
        var endDate = new Date("2020/08/08 15:13");
        var game_data_race = {time_elapsed: getMinutesOfDates(startDate, endDate), win_condition: 100}
        
        var game_json = { winner_id: 1, winner_name: "user_1", game_mode: 'Race', game_date: new Date(), 
                        player_stats: player_data_race, game_stats: game_data_race, player_ids: [1,2]}
        const response = await chai.request(app)
                                   .post("/api/gameHistory/")
                                   .set('content-type', 'application/json')
                                   .set('token', token)
                                   .send(game_json)
        response.should.have.status(200);
        response.body.should.be.eq(true);           
    });

    it("It should create a new race mode category history for user with id=1", async ()=>{
        var player_data_category = {user_1: {categories: ["Internet and Telecom","Law and Government","Law and Government","Science", "Food and Drink", "News and Media"]},
                                    user_2: {categories: ["Internet and Telecom", "Science", "Science", "Food and Drink", "Food and Drink"]}}
        var startDate = new Date("2020/08/08 15:00");
        var endDate = new Date("2020/08/08 15:13");
        var game_data_category = {time_elapsed: getMinutesOfDates(startDate, endDate), win_condition: "News and Media"}

        var game_json = { winner_id: 1, winner_name: "user_1", game_mode: 'Category', game_date: new Date(), 
                        player_stats: player_data_category, game_stats: game_data_category, player_ids: [1,2]}

        const response = await chai.request(app)
                                   .post("/api/gameHistory/")
                                   .set('content-type', 'application/json')
                                   .set('token', token)
                                   .send(game_json)
        response.should.have.status(200);
        response.body.should.be.eq(true);         
    });

    it("It should return 4 games for user with id=1", async()=>{
        const user_id = 1
        const response = await chai.request(app).get("/api/gameHistory/" + user_id);
        response.should.have.status(200)
        response.body.length.should.equal(4)
    })
});