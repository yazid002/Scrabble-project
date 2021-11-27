import { Leaderboard } from '@app/classes/Leaderboard';
import { LeaderBoardService } from '@app/services/Leaderboard.service';
// import Types from '@app/types';
import { Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class LeaderBoardController {
    router: Router;

    constructor(private leaderboardService: LeaderBoardService) {
        this.configureRouter();
    }

    resetClassic() {
        this.leaderboardService.resetClassic();
    }

    resetMode2990() {
        this.leaderboardService.resetMode2990();
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
            console.log(this.leaderboardService);
            try {
                const players = await this.leaderboardService.getAll2990Players();
                res.json(players);
            } catch (error) {
                res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/ClassicLeaderboard', async (req: Request, res: Response) => {
            this.leaderboardService
                .getAllClassicPlayers()
                .then((leaderboard: Leaderboard[]) => {
                    res.json(leaderboard);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/:name', async (req: Request, res: Response) => {
            this.leaderboardService
                .getClassicPlayer(req.params.name)
                .then((leaderboard: Leaderboard) => {
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
            this.leaderboardService
                .addClassicPlayer(req.body, this.leaderboardService)
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
        // this.router.delete('/:name', async (req: Request, res: Response) => {
        //     this.leaderboardService
        //         .deleteClassicPlayer(req.params.name,)
        //         .then(() => {
        //             res.status(Httpstatus.StatusCodes.NO_CONTENT).send();
        //         })
        //         .catch((error: Error) => {
        //             res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
        //         });
        // });
    }
}
