import { Leaderboard } from '@app/classes/Leaderboard';
import { LeaderBoardService } from '@app/services/Leaderboard.service';
// import Types from '@app/types';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class LeaderBoardController {
    router: Router;

    constructor(private leaderboardService: LeaderBoardService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            console.log(req.body);
            const players = await this.leaderboardService.getAll2990Players();
            res.json(players);
        });

        this.router.get('/ClassicLeaderboard', async (req: Request, res: Response) => {
            this.leaderboardService.getAllClassicPlayers().then((leaderboard: Leaderboard[]) => {
                res.json(leaderboard);
            });
            // .catch((error: Error) => {
            //     res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
            // });
        });
    }
}
