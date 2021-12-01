import { WordValidationService } from '@app/services/word-validation.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class WordValidationController {
    router: Router;

    constructor(private readonly wordValidationService: WordValidationService) {
        this.configureRouter();
        this.router.post = this.router.post.bind(this);
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * definitions:
         *   DictionaryValidationResponse:
         *     type: object
         *     properties:
         *       wordExists:
         *         type: boolean
         *       errorMessage:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Validation
         *     description: Validation endpoints
         */

        /**
         * @swagger
         *
         * /api/validate:
         *   post:
         *     description: Verifies if all the words sent exist in the current dictionary
         *     tags:
         *       - Validation
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/DictionaryValidationResponse'
         *       503:
         *         schema:
         *             type: string
         */
        this.router.post('/', async (req: Request, res: Response) => {
            try {
                const wordExists = this.wordValidationService.validateWord(req.body);
                res.json(wordExists);
            } catch (error) {
                res.status(StatusCodes.SERVICE_UNAVAILABLE).send(error.message);
            }
        });
    }
}
