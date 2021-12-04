import { Leaderboard } from '@app/classes/leaderboard';
import { LeaderboardService } from '@app/services/leaderboard.service';
// import Types from '@app/types';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class LeaderBoardController {
    router: Router;

    constructor(private leaderboardService: LeaderboardService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            const players = await this.leaderboardService.getAll2990Players();
            res.json(players);
        });

        this.router.get('/ClassicLeaderboard', async (req: Request, res: Response) => {
            this.leaderboardService.getAllClassicPlayers().then((leaderboard: Leaderboard[]) => {
                res.json(leaderboard);
            });
        });

        this.router.get('/reset', async (req: Request, res: Response) => {
            const leaderboards = await this.leaderboardService.reset();
            res.json(leaderboards);
        });
    }
}
