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

            const names = await this.virtualPlayerNamesService.addName(req.body);
            res.json(names);
        });
        this.router.post('/delete', async (req: Request, res: Response) => {
            console.log('delete name controller', req.body);

            const names = this.virtualPlayerNamesService.delete(req.body);
            res.json(names);
        });
        this.router.get('/reset', async (req: Request, res: Response) => {
            console.log('reset controler ', req.body);

            const names = this.virtualPlayerNamesService.reset();
            res.json(names);
        });
        this.router.get('/', async (req: Request, res: Response) => {
            console.log('get name controller ', req.body);

            const names = await this.virtualPlayerNamesService.getNames();
            console.log(names);
            res.json(names);
        });
    }
}
