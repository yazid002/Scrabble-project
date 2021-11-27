import { Leaderboard } from '@app/classes/Leaderboard';
import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

// CHANGE the URL for your database information
const DATABASE_COLLECTION_CLASSIC = 'Classic';
const DATABASE_COLLECTION_2990 = 'Mode 2990';

@Service()
export class LeaderBoardService {
    constructor(private databaseService: DatabaseService) {}

    get collectionClassic(): Collection<Leaderboard> {
        return this.databaseService.database.collection(DATABASE_COLLECTION_CLASSIC);
    }

    get collection2990(): Collection<Leaderboard> {
        return this.databaseService.database.collection(DATABASE_COLLECTION_2990);
    }

    // async getAllCourses(): Promise<Leaderboard[]> {
    //     return this.collection
    //         .find({})
    //         .toArray()
    //         .then((leaderboards: Leaderboard[]) => {
    //             return leaderboards;
    //         });
    // }
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

    async getClassicPlayer(player: string): Promise<Leaderboard> {
        return this.collectionClassic.findOne({ name: player }).then((playerInfo: Leaderboard) => {
            return playerInfo;
        });
    }

    async get2990Player(player: string): Promise<Leaderboard> {
        return this.collection2990.findOne({ name: player }).then((playerInfo: Leaderboard) => {
            return playerInfo;
        });
    }

    async addClassicPlayer(player: Leaderboard, leaderboardService: LeaderBoardService): Promise<void> {
        await leaderboardService.collectionClassic.insertOne(player);
    }

    async add2990Player(player: Leaderboard, leaderboardService: LeaderBoardService): Promise<void> {
        await leaderboardService.collection2990.insertOne(player);
    }

    async deleteClassicPlayer(player: string, leaderboardService: LeaderBoardService): Promise<void> {
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

    async delete2990Player(player: string, leaderboardService: LeaderBoardService): Promise<void> {
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

    async resetClassic() {
        this.databaseService.resetClassicLeaderboard();
    }

    async resetMode2990() {
        this.databaseService.resetMode2990Leaderboard();
    }

    async endGame(player: Leaderboard) {
        let leaderboard: Leaderboard[] = [];
        let deleteFunction: (name: string, leaderboardService: LeaderBoardService) => Promise<void>;
        let addFunction: (player: Leaderboard, leaderboardService: LeaderBoardService) => Promise<void>;
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
            console.log('dans serveur');
            await deleteFunction(leaderboard[leaderboard.length - 1].name, this);
            await addFunction(player, this);
        }
    }

    // private validatePlayer(player: Leaderboard): boolean {}

    // async addCourse(course: Leaderboard): Promise<void> {
    //     if (this.validateCourse(course)) {
    //         await this.collection.insertOne(course).catch((error: Error) => {
    //             throw new HttpException(500, 'Failed to insert course');
    //         });
    //     } else {
    //         throw new Error('Invalid course');
    //     }
    // }

    // async deleteCourse(sbjCode: string): Promise<void> {
    //     return this.collection
    //         .findOneAndDelete({ subjectCode: sbjCode })
    //         .then((res: FindAndModifyWriteOpResultObject<Leaderboard>) => {
    //             if (!res.value) {
    //                 throw new Error('Could not find course');
    //             }
    //         })
    //         .catch(() => {
    //             throw new Error('Failed to delete course');
    //         });
    // }

    // async modifyCourse(course: Course): Promise<void> {
    //     const filterQuery: FilterQuery<Course> = { subjectCode: course.subjectCode };
    //     const updateQuery: UpdateQuery<Course> = {
    //         $set: {
    //             subjectCode: course.subjectCode,
    //             credits: course.credits,
    //             name: course.name,
    //             teacher: course.teacher,
    //         },
    //     };
    //     // Can also use replaceOne if we want to replace the entire object
    //     return this.collection
    //         .updateOne(filterQuery, updateQuery)
    //         .then(() => {})
    //         .catch(() => {
    //             throw new Error('Failed to update document');
    //         });
    // }

    // async getCourseTeacher(sbjCode: string): Promise<string> {
    //     const filterQuery: FilterQuery<Course> = { subjectCode: sbjCode };
    //     // Only get the teacher and not any of the other fields
    //     const projection: FindOneOptions = { projection: { teacher: 1, _id: 0 } };
    //     return this.collection
    //         .findOne(filterQuery, projection)
    //         .then((course: Course) => {
    //             return course.teacher;
    //         })
    //         .catch(() => {
    //             throw new Error('Failed to get data');
    //         });
    // }
    // async getCoursesByTeacher(name: string): Promise<Course[]> {
    //     const filterQuery: FilterQuery<Course> = { teacher: name };
    //     return this.collection
    //         .find(filterQuery)
    //         .toArray()
    //         .then((courses: Course[]) => {
    //             return courses;
    //         })
    //         .catch(() => {
    //             throw new Error('No courses for that teacher');
    //         });
    // }

    // private validateCourse(course: Course): boolean {
    //     return this.validateCode(course.subjectCode) && this.validateCredits(course.credits);
    // }
    // private validateCode(subjectCode: string): boolean {
    //     return subjectCode.startsWith('LOG') || subjectCode.startsWith('INF');
    // }
    // private validateCredits(credits: number): boolean {
    //     return credits > 0 && credits <= 6;
    // }
}
