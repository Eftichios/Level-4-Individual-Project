const LobbyHandler = require("../utils/LobbyHandler")
const app = require("../express/app")
var chai = require("chai")
var chaiHttp = require("chai-http")

chai.should();
chai.use(chaiHttp);

describe("Lobby handler tests", ()=>{
    let lobby_handler
    before("Initialise lobby handler", async ()=>{
        lobby_handler = new LobbyHandler()
    })

    it("It should create a new lobby of Race mode", async ()=>{
        const lobby = lobby_handler.findOrCreateLobby("Race")
        lobby.room.should.be.eq("Room0")
        lobby.game_mode.should.be.eq("Race")   
    })

    it("It should add a player to the lobby with room=Room0", async ()=>{
        const lobby = lobby_handler.findOrCreateLobby("Race")
        lobby.addPlayer("dummy_socket_id", "user_1", 1)
        lobby.getNumberOfPlayers().should.be.eq(1)
    })

    it("It should change the ready state of the player in the lobby with room=Room0", async ()=>{
        const lobby = lobby_handler.findOrCreateLobby("Race")
        lobby.playerToggleReady(1, true)
        lobby.playerIds[1]["ready"].should.be.eq(true)
    })

    it("It should return that all players are ready in the lobby with room=Room0", async ()=>{
        const lobby = lobby_handler.findOrCreateLobby("Race")
        lobby.checkIfAllReady().should.be.eq(true)
    })

    it("It should return that the lobby with room=Room0 is not full", async ()=>{
        const lobby = lobby_handler.findOrCreateLobby("Race")
        lobby.isLobbyFull().should.be.eq(false)
    })

    it("It should return that the lobby with room=Room0 is not in game", async ()=>{
        const lobby = lobby_handler.findOrCreateLobby("Race")
        lobby.isLobbyInGame().should.be.eq(false)
    })

    it("It should remove the player from the lobby with room=Room0", async ()=>{
        const lobby = lobby_handler.findOrCreateLobby("Race")
        lobby.removePlayer(1)
        lobby.getNumberOfPlayers().should.be.eq(0)
    })

    it("It should remove the lobby with room=Room0", async ()=>{
        lobby_handler.clearEmptyLobbies()
        lobby_handler.lobbies.length.should.be.eq(0)
    })

    
});
