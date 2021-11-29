import { Leaderboard } from '@app/classes/Leaderboard';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
// import { MongoClient } from 'mongodb';
import { DatabaseService } from './database.service';
// import { DatabaseServiceMock } from './database.service.mock';
import { LeaderboardService } from './Leaderboard.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('leaderboard service', () => {
    let leaderboardService: LeaderboardService;
    // let databaseService: DatabaseServiceMock;
    let databaseService: DatabaseService;
    // let client: MongoClient;
    let testPlayer1: Leaderboard;
    let testPlayer2: Leaderboard;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        // client = (await databaseService.start()) as MongoClient;
        leaderboardService = new LeaderboardService(databaseService as DatabaseService);
        testPlayer1 = {
            name: 'TestPlayer1',
            score: 10,
            mode: 'Classic',
        };
        await leaderboardService.collectionClassic.insertOne(testPlayer1);

        testPlayer2 = {
            name: 'TestPlayer2',
            score: 20,
            mode: 'Classic',
        };
        await leaderboardService.collection2990.insertOne(testPlayer2);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all players from Classic DB', async () => {
        const players = await leaderboardService.getAllClassicPlayers();
        expect(players.length).to.equal(1);
        expect(testPlayer1).to.deep.equals(players[0]);
    });

    it('should get all players from Mode2990 DB', async () => {
        const players = await leaderboardService.getAll2990Players();
        expect(players.length).to.equal(1);
        expect(testPlayer2).to.deep.equals(players[0]);
    });
});
