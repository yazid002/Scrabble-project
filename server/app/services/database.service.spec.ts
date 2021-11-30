// Disable to have access to private objects
/* eslint-disable dot-notation */
// import { NameProperties } from '@app/classes/name-properties';
// import { VirtualPlayerNamesService } from './virtual-player-names.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService, DATABASE_MAX_VALUE } from './database.service';

chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let mongoUri: string;
    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = await MongoMemoryServer.create();
        mongoUri = await mongoServer.getUri();
    });

    afterEach(async () => {
        if (databaseService['client'] && databaseService['client'].isConnected()) {
            await databaseService['client'].close();
        }
    });

    // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
    it('should connect to the database when start is called', async () => {
        // Reconnect to local server
        await databaseService.start(mongoUri);
        expect(databaseService['db'].databaseName).to.equal('Leaderboard');
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        // Try to reconnect to local server
        try {
            await databaseService.start('WRONG URL');
            // fail();
        } catch {
            expect(databaseService['db']).to.not.equal('Leaderboard');
        }
    });

    it('should populate the Mode2990 collection with a helper function', async () => {
        const client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        databaseService['db'] = client.db('database');
        await databaseService.populateMode2990LeaderBoard();
        const players = await databaseService.database.collection('Mode 2990').find({}).toArray();
        expect(players.length).to.equal(DATABASE_MAX_VALUE);
    });

    it('should populate the Classic collection with a helper function', async () => {
        const client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        databaseService['db'] = client.db('database');
        await databaseService.populateClassicLeaderBoard();
        const players = await databaseService.database.collection('Classic').find({}).toArray();
        expect(players.length).to.equal(DATABASE_MAX_VALUE);
    });

    it('should not populate the database with start function if it is already populated', async () => {
        await databaseService.start(mongoUri);
        let players = await databaseService.database.collection('Mode 2990').find({}).toArray();
        expect(players.length).to.equal(DATABASE_MAX_VALUE);
        await databaseService.closeConnection();
        await databaseService.start(mongoUri);
        players = await databaseService.database.collection('Mode 2990').find({}).toArray();
        expect(players.length).to.equal(DATABASE_MAX_VALUE);
    });
});
