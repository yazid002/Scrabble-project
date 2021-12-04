import { Leaderboard } from '@app/classes/leaderboard';
import { NameProperties } from '@app/classes/name-properties';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Admin:Admin@cluster0.aabdh.mongodb.net/Leaderboard?retryWrites=true&w=majority';
const DATABASE_NAME = 'Leaderboard';
const DATABASE_COLLECTION = 'Mode 2990';
const DATABASE_COLLECTION_CLASSIC = 'Classic';
export const DATABASE_MAX_VALUE = 5;
export const DATABASE_VIRTUAL_NAMES = 'VirtualPlayerNames';

@Service()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        if ((await this.db.collection(DATABASE_COLLECTION).countDocuments()) !== DATABASE_MAX_VALUE) {
            await this.db.collection(DATABASE_COLLECTION).deleteMany({});
            await this.populateMode2990LeaderBoard();
        }
        if ((await this.db.collection(DATABASE_COLLECTION_CLASSIC).countDocuments()) !== DATABASE_MAX_VALUE) {
            await this.db.collection(DATABASE_COLLECTION_CLASSIC).deleteMany({});
            await this.populateClassicLeaderBoard();
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }
    async addName(name: NameProperties): Promise<void> {
        await this.db.collection(DATABASE_VIRTUAL_NAMES).insertOne(name);
        return undefined;
    }
    async reset() {
        if (!this.db) await this.start();
        await this.db.collection(DATABASE_VIRTUAL_NAMES).deleteMany({ default: { $eq: false } });
    }

    async resetLeaderboard() {
        await this.db.collection(DATABASE_COLLECTION).deleteMany({});
        await this.populateMode2990LeaderBoard();
        await this.db.collection(DATABASE_COLLECTION_CLASSIC).deleteMany({});
        await this.populateClassicLeaderBoard();
    }

    async populateMode2990LeaderBoard(): Promise<void> {
        const leaderboards: Leaderboard[] = [
            {
                name: 'George',
                score: 5,
                mode: 'log2990',
            },
            {
                name: 'Georges',
                score: 10,
                mode: 'log2990',
            },
            {
                name: 'Georgio',
                score: 15,
                mode: 'log2990',
            },
            {
                name: 'Georgios',
                score: 20,
                mode: 'log2990',
            },
            {
                name: 'Georgius',
                score: 25,
                mode: 'log2990',
            },
        ];

        for (const player of leaderboards) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(player);
        }
    }

    async populateClassicLeaderBoard(): Promise<void> {
        const leaderboards: Leaderboard[] = [
            {
                name: 'Bobby',
                score: 5,
                mode: 'classic',
            },
            {
                name: 'Dobby',
                score: 10,
                mode: 'classic',
            },
            {
                name: 'Robby',
                score: 15,
                mode: 'classic',
            },
            {
                name: 'Lobby',
                score: 20,
                mode: 'classic',
            },
            {
                name: 'Mobby',
                score: 25,
                mode: 'classic',
            },
        ];

        for (const player of leaderboards) {
            await this.db.collection(DATABASE_COLLECTION_CLASSIC).insertOne(player);
        }
    }

    get database(): Db {
        return this.db;
    }
}
