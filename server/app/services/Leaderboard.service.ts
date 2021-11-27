import { Leaderboard } from '@app/classes/Leaderboard';
import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

// CHANGE the URL for your database information
const DATABASE_COLLECTION_CLASSIC = 'Classic';
const DATABASE_COLLECTION_2990 = 'Mode 2990';

@Service()
export class ClassicLeaderBoardService {
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
    async getAllPlayers(): Promise<Leaderboard[]> {
        return this.collection2990
            .find({})
            .toArray()
            .then((leaderboards: Leaderboard[]) => {
                return leaderboards;
            });
    }

    async getAllClassicPlayers(): Promise<Leaderboard[]> {
        return this.collectionClassic
            .find({})
            .toArray()
            .then((leaderboards: Leaderboard[]) => {
                return leaderboards;
            });
    }

    // async getCourse(sbjCode: string): Promise<Leaderboard> {
    //     // NB: This can return null if the course does not exist, you need to handle it
    //     return this.collection.findOne({ subjectCode: sbjCode }).then((course: Leaderboard) => {
    //         return course;
    //     });
    // }
    async getPlayer(player: string): Promise<Leaderboard> {
        return this.collection2990.findOne({ name: player }).then((playerInfo: Leaderboard) => {
            return playerInfo;
        });
    }

    async getPlayersScore(player: string): Promise<string> {
        return this.collection2990.findOne({ name: player }).then((score: Leaderboard) => {
            return score.id;
        });
    }

    async addPlayer(player: Leaderboard): Promise<void> {
        await this.collection2990.insertOne(player);
    }

    async deletePlayer(player: string): Promise<void> {
        return this.collection2990
            .findOneAndDelete({ name: player })
            .then((res: FindAndModifyWriteOpResultObject<Leaderboard>) => {
                if (!res.value) {
                    throw new Error('Could not find course');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete course');
            });
    }

    async resetClassic() {
        this.databaseService.resetClassicLeaderboard();
    }

    async resetMode2990() {
        this.databaseService.resetMode2990Leaderboard();
    }

    // endGame(mode: string, name: string, score: number) {
    //     let leaderboard: Leaderboard[] = [];
    //     if (mode === 'Classic') {
    //         leaderboard = this.getAllClassicPlayers();
    //     }
    //     else {
    //         leaderboard = this.getAllPlayers();
    //     }

    // }

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
