import { Leaderboard } from '@app/classes/leaderboard';
import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

// CHANGE the URL for your database information
const DATABASE_COLLECTION_CLASSIC = 'Classic';
const DATABASE_COLLECTION_2990 = 'Mode 2990';

@Service()
export class LeaderboardService {
    constructor(private databaseService: DatabaseService) {}

    get collectionClassic(): Collection<Leaderboard> {
        return this.databaseService.database.collection(DATABASE_COLLECTION_CLASSIC);
    }

    get collection2990(): Collection<Leaderboard> {
        return this.databaseService.database.collection(DATABASE_COLLECTION_2990);
    }

    async getAll2990Players(): Promise<Leaderboard[]> {
        return this.collection2990
            .find({})
            .toArray()
            .then((leaderboards: Leaderboard[]) => {
                return leaderboards.sort((a: Leaderboard, b: Leaderboard) => b.score - a.score);
            });
    }

    async getAllClassicPlayers(): Promise<Leaderboard[]> {
        return this.collectionClassic
            .find({})
            .toArray()
            .then((leaderboards: Leaderboard[]) => {
                return leaderboards.sort((a: Leaderboard, b: Leaderboard) => b.score - a.score);
            });
    }

    async addClassicPlayer(player: Leaderboard, leaderboardService: LeaderboardService): Promise<void> {
        await leaderboardService.collectionClassic.insertOne(player);
    }

    async add2990Player(player: Leaderboard, leaderboardService: LeaderboardService): Promise<void> {
        await leaderboardService.collection2990.insertOne(player);
    }

    async deleteClassicPlayer(player: string, leaderboardService: LeaderboardService): Promise<void> {
        return await leaderboardService.collectionClassic
            .findOneAndDelete({ name: player })
            .then((res: FindAndModifyWriteOpResultObject<Leaderboard>) => {
                if (!res.value) {
                    throw new Error('Could not find player');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete player');
            });
    }

    async delete2990Player(player: string, leaderboardService: LeaderboardService): Promise<void> {
        return await leaderboardService.collection2990
            .findOneAndDelete({ name: player })
            .then((res: FindAndModifyWriteOpResultObject<Leaderboard>) => {
                if (!res.value) {
                    throw new Error('Could not find player');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete player');
            });
    }

    async reset() {
        await this.databaseService.resetLeaderboard();
    }

    async endGame(player: Leaderboard) {
        let leaderboard: Leaderboard[] = [];
        let deleteFunction: (name: string, leaderboardService: LeaderboardService) => Promise<void>;
        let addFunction: (player: Leaderboard, leaderboardService: LeaderboardService) => Promise<void>;
        if (player.mode === 'classic') {
            leaderboard = await this.getAllClassicPlayers();
            deleteFunction = this.deleteClassicPlayer;
            addFunction = this.addClassicPlayer;
        } else {
            leaderboard = await this.getAll2990Players();
            deleteFunction = this.delete2990Player;
            addFunction = this.add2990Player;
        }
        if (player.score > leaderboard[leaderboard.length - 1].score) {
            await deleteFunction(leaderboard[leaderboard.length - 1].name, this);
            await addFunction(player, this);
        }
    }
}
