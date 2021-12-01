import { VirtualPlayerNamesService } from '@app/services/virtual-player-names.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class VirtualPlayerNamesController {
    router: Router;

    constructor(private readonly virtualPlayerNamesService: VirtualPlayerNamesService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Time
         *     description: Time endpoints
         */

        /**
         * @swagger
         *
         * /api/validate:
         *   get:
         *     description: Return current time
         *     tags:
         *       - Time
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.post('/', async (req: Request, res: Response) => {
            try {
                const names = this.virtualPlayerNamesService.names;
                res.json(names);
            } catch (error) {
                res.status(StatusCodes.SERVICE_UNAVAILABLE).send(error.message);
            }
        });
    }
}
