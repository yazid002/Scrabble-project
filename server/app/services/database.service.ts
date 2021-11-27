import { Leaderboard } from '@app/classes/Leaderboard';
import { NameProperties } from '@app/classes/name-properties';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
// import { Course } from '../classes/course';

// CHANGE the URL for your database information
const DATABASE_URL =
    // "mongodb+srv://Admin:admin12345@cluster0.hcrok.mongodb.net/<dbname>?retryWrites=true&w=majority";
    'mongodb+srv://Admin:Admin@cluster0.aabdh.mongodb.net/Leaderboard?retryWrites=true&w=majority';
const DATABASE_NAME = 'Leaderboard';
const DATABASE_COLLECTION = 'Mode 2990';
const DATABASE_COLLECTION_CLASSIC = 'Classic';
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
        if ((await this.db.collection(DATABASE_COLLECTION).countDocuments()) === 0) {
            await this.populateMode2990LeaderBoard();
        }
        if ((await this.db.collection(DATABASE_COLLECTION_CLASSIC).countDocuments()) === 0) {
            await this.populateClassicLeaderBoard();
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }
    async addName(name: NameProperties) {
        await this.db.collection(DATABASE_VIRTUAL_NAMES).insertOne(name);
    }
    async reset(): Promise<void> {
        await this.db.collection(DATABASE_VIRTUAL_NAMES).deleteMany({ default: { $eq: false } });
        // for (const name of names) {
        //     this.db.collection(DATABASE_VIRTUAL_NAMES).insertOne(name);
        // }
    }

    async resetClassicLeaderboard(): Promise<void> {
        await this.db.collection(DATABASE_COLLECTION_CLASSIC).deleteMany({});
    }

    async resetMode2990Leaderboard(): Promise<void> {
        await this.db.collection(DATABASE_COLLECTION).deleteMany({});
    }

    async populateMode2990LeaderBoard(): Promise<void> {
        const leaderboards: Leaderboard[] = [
            {
                name: 'Player 1',
                score: 10,
                mode: 'log2990',
            },
            {
                name: 'Player 2',
                score: 20,
                mode: 'log2990',
            },
            {
                name: 'Player 3',
                score: 30,
                mode: 'log2990',
            },
            {
                name: 'Player 4',
                score: 40,
                mode: 'log2990',
            },
            {
                name: 'Player 5',
                score: 50,
                mode: 'log2990',
            },
        ];

        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const player of leaderboards) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(player);
        }
    }

    async populateClassicLeaderBoard(): Promise<void> {
        const leaderboards: Leaderboard[] = [
            {
                name: 'Player 6',
                score: 10,
                mode: 'classic',
            },
            {
                name: 'Player 7',
                score: 20,
                mode: 'classic',
            },
            {
                name: 'Player 8',
                score: 30,
                mode: 'classic',
            },
            {
                name: 'Player 9',
                score: 40,
                mode: 'classic',
            },
            {
                name: 'Player 10',
                score: 50,
                mode: 'classic',
            },
        ];

        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const player of leaderboards) {
            await this.db.collection(DATABASE_COLLECTION_CLASSIC).insertOne(player);
        }
    }

    get database(): Db {
        return this.db;
    }
}
