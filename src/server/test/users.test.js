const app = require("../express/app")
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("Users API", ()=>{
    it("It should return all users", async ()=>{
        const response = await chai.request(app).get("/api/users");
        response.should.have.status(200)
            
    })

    it("It should return the user with id=1", async ()=>{
        const user_id = 1
        const response = await chai.request(app).get("/api/users/" + user_id)
        response.should.have.status(200);
        response.body.user_id.should.be.eq(1);           
    });

    it("It should return no user exists with id=90", async ()=>{
        const user_id = 90
        const response = await chai.request(app).get("/api/users/" + user_id)
        response.should.have.status(404);
        response.body.should.be.eq('No user exists with the given id.');           
    });

    it("It should return user with user_id=1 by name", async ()=>{
        const name = "user_1";
        const response = await chai.request(app)
                                   .post("/api/users/name")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name});
        response.should.have.status(200);
        response.body.user_id.should.be.eq(1);
        response.body.user_name.should.be.eq(name);
    })

    it("It should return no user exists by non-registered name", async ()=>{
        const name = "does_not_exist";
        const response = await chai.request(app)
                                   .post("/api/users/name")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name});
        response.should.have.status(404);
        response.body.should.be.eq('No user exists with the given user name.');
    })

    it("It should fail to register a new user with pass < 6 char", async ()=>{
        const name = "unit_test";
        const pass = "1234";
        const owns_plugin = true;
        const response = await chai.request(app)
                                   .post("/api/auth/register")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: pass, confirm_password: pass, owns_plugin: owns_plugin});
        response.body.should.be.eq("Password should be at least 6 characters long.")
        response.should.have.status(401);
    })

    it("It should fail to register a new user with username < 3 char", async ()=>{
        const name = "u";
        const pass = "123456";
        const owns_plugin = true;
        const response = await chai.request(app)
                                   .post("/api/auth/register")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: pass, confirm_password: pass, owns_plugin: owns_plugin});
        response.body.should.be.eq("User name should be at least 3 characters long.")
        response.should.have.status(401);
    })

    it("It should register a new user with name unit_test", async ()=>{
        const name = "unit_test";
        const pass = "123456";
        const owns_plugin = true;
        const response = await chai.request(app)
                                   .post("/api/auth/register")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: pass, confirm_password: pass, owns_plugin: owns_plugin});
        response.body.should.have.property("token")
        response.should.have.status(200);
    })

    it("It should update the new users password", async ()=>{
        const name = "unit_test";
        const old_pass = "123456";
        const new_pass = "test_123"
        const temp_response = await chai.request(app)
                                   .post("/api/auth/login")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: old_pass});
        const response = await chai.request(app)
                                   .put("/api/users/" + temp_response.body.user_id)
                                   .set('content-type', 'application/json')
                                   .set('token', temp_response.body.token)
                                   .send({new_pass: new_pass, old_pass: old_pass, user_id: temp_response.body.user_id});
        response.body.success.should.be.eq(true)
        response.should.have.status(200);
    })

    it("It should update the new users profile picture", async ()=>{
        const name = "unit_test";
        const pass = "test_123"
        const temp_response = await chai.request(app)
                                   .post("/api/auth/login")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: pass});
        const response = await chai.request(app)
                                   .put("/api/users/updateProfile/" + temp_response.body.user_id)
                                   .set('content-type', 'application/json')
                                   .set('token', temp_response.body.token)
                                   .send({icon_path: "lilah_bot.svg", user_id: temp_response.body.user_id});
        response.body.success.should.be.eq(true)
        response.should.have.status(200);
    })

    it("It should destroy the new user with name unit_test", async ()=>{
        const name = "unit_test";
        const pass = "test_123";
        const temp_response = await chai.request(app)
                                   .post("/api/auth/login")
                                   .set('content-type', 'application/json')
                                   .send({user_name: name, password: pass});
        const response = await chai.request(app)
                                   .delete("/api/users/" + temp_response.body.user_id)
                                   .set('content-type', 'application/json')
                                   .set('token', temp_response.body.token)
                                   .send({user_id: temp_response.body.user_id});
        response.should.have.status(200);
    })

});