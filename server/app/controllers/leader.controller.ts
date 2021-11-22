import { Leaderboard } from '@app/classes/Leaderboard';
import { ClassicLeaderBoardService } from '@app/services/Leaderboard.service';
// import Types from '@app/types';
import { Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class LeaderBoardController {
    router: Router;

    constructor(private classicLeaderboardService: ClassicLeaderBoardService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            //         // this.coursesService
            //         //   .getAllCourses()
            //         //   .then((courses: Course[]) => {
            //         //     res.json(courses);
            //         //   })
            //         //   .catch((error: Error) => {
            //         //     res.status(Httpstatus.NOT_FOUND).send(error.message);
            //         //   });

            // Can also use the async/await syntax
            console.log(this.classicLeaderboardService);
            try {
                const players = await this.classicLeaderboardService.getAllPlayers();
                res.json(players);
            } catch (error) {
                res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:name', async (req: Request, res: Response) => {
            this.classicLeaderboardService
                .getPlayer(req.params.name)
                .then((leaderboard: Leaderboard) => {
                    res.json(leaderboard);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/:name/score', async (req: Request, res: Response) => {
            this.classicLeaderboardService
                .getPlayersScore(req.params.name)
                .then((leaderboard: string) => {
                    res.json(leaderboard);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        // this.router.post('/', async (req: Request, res: Response) => {
        //     console.log(req.body);
        //     this.coursesService
        //         .addCourse(req.body)
        //         .then(() => {
        //             res.status(Httpstatus.StatusCodes.CREATED).send();
        //         })
        //         .catch((error: Error) => {
        //             res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
        //         });
        // });

        this.router.post('/', async (req: Request, res: Response) => {
            this.classicLeaderboardService
                .addPlayer(req.body)
                .then(() => {
                    res.status(Httpstatus.StatusCodes.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        // this.router.patch('/', async (req: Request, res: Response) => {
        //     this.coursesService
        //         .modifyCourse(req.body)
        //         .then(() => {
        //             res.sendStatus(Httpstatus.StatusCodes.OK);
        //         })
        //         .catch((error: Error) => {
        //             res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
        //         });
        // });

        // this.router.delete('/:subjectCode', async (req: Request, res: Response) => {
        //     this.coursesService
        //         .deleteCourse(req.params.subjectCode)
        //         .then(() => {
        //             res.status(Httpstatus.StatusCodes.NO_CONTENT).send();
        //         })
        //         .catch((error: Error) => {
        //             console.log(error);
        //             res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
        //         });
        // });
        this.router.delete('/:name', async (req: Request, res: Response) => {
            this.classicLeaderboardService
                .deletePlayer(req.params.name)
                .then(() => {
                    res.status(Httpstatus.StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        // this.router.get('/teachers/code/:subjectCode', async (req: Request, res: Response) => {
        //     this.coursesService
        //         .getCourseTeacher(req.params.subjectCode)
        //         .then((teacher: string) => {
        //             res.send(teacher);
        //         })
        //         .catch((error: Error) => {
        //             res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
        //         });
        // });

        // this.router.get('/teachers/name/:name', async (req: Request, res: Response) => {
        //     this.coursesService
        //         .getCoursesByTeacher(req.params.name)
        //         .then((leaderboard: Leaderboard[]) => {
        //             res.send(leaderboard);
        //         })
        //         .catch((error: Error) => {
        //             res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
        //         });
        //     });
    }
}
