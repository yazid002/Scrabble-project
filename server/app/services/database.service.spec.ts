// Disable to have access to private objects
/* eslint-disable dot-notation */
// import { fail } from "assert";
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
// import { MongoClient } from "mongodb";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        // mongoServer = new MongoMemoryServer();
        mongoServer = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        if (databaseService['client'] && databaseService['client'].isConnected()) {
            await databaseService['client'].close();
        }
    });

    // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
    it('should connect to the database when start is called', async () => {
        // Reconnect to local server
        const mongoUri = mongoServer.getUri();
        await databaseService.start(mongoUri);
        // expect(databaseService['client']).to.not.be.undefined;
        expect(databaseService['db'].databaseName).to.equal('Leaderboard');
    });
});
