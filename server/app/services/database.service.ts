import { Leaderboard } from '@app/classes/Leaderboard';
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
            await this.populateDB();
        }
        if ((await this.db.collection(DATABASE_COLLECTION_CLASSIC).countDocuments()) === 0) {
            await this.populateClassicDB();
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDB(): Promise<void> {
        const leaderboards: Leaderboard[] = [
            {
                id: '12345',
                name: 'Player 1',
                score: 50,
            },
            {
                id: '23456',
                name: 'Player 2',
                score: 60,
            },
            {
                id: '34567',
                name: 'Player 3',
                score: 60,
            },
        ];

        console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const player of leaderboards) {
            await this.db.collection(DATABASE_COLLECTION).insertOne(player);
        }
    }

    async populateClassicDB(): Promise<void> {
        const leaderboards: Leaderboard[] = [
            {
                id: '12345',
                name: 'Player 6',
                score: 50,
            },
            {
                id: '23456',
                name: 'Player 7',
                score: 60,
            },
            {
                id: '34567',
                name: 'Player 8',
                score: 60,
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
