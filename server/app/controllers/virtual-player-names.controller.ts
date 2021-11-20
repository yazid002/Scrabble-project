import { VirtualPlayerNamesService } from '@app/services/virtual-player-names.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class VirtualPlayerNamesController {
    router: Router;

    constructor(private readonly virtualPlayerNamesService: VirtualPlayerNamesService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/add', async (req: Request, res: Response) => {
            console.log('add name controller', req.body);

            const names = this.virtualPlayerNamesService.addName(req.body);
            res.json(names);
        });
        this.router.get('/', async (req: Request, res: Response) => {
            console.log('get name ocntroller ', req.body);

            const names = this.virtualPlayerNamesService.getNames();
            res.json(names);
        });
    }
}
