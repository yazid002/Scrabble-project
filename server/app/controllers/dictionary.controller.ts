// disable because we can't seem to import multer using an import statement
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { TitleDescriptionOfDictionary } from '@app/models/titleDescriptionOfDictionary.model';
import { DictionaryService } from '@app/services/dictionary.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { FileMessages } from './../models/file-messages.model';
const multer = require('multer');
@Service()
export class DictionaryController {
    fileMessages: FileMessages = {
        isuploaded: true,
        message: '',
    };
    router: Router;
    constructor(private dictionaryService: DictionaryService) {
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
        // ============== add new dictionary ===================================
        let fileName = '';

        const storage = multer.diskStorage({
            destination: (req: Request, file: File, cb: (arg0: null, arg1: string) => void) => {
                cb(null, './app/assets/');
            },
            filename: (req: Request, file: { originalname: string }, cb: (arg0: null, arg1: string) => void) => {
                cb(null, `${file.originalname}`);
                fileName = file.originalname;
            },
        });
        const upload = multer({ storage });
        this.router.post('/addNewDictionary', upload.single('file'), async (req: Request, res: Response) => {
            try {
                await this.dictionaryService.addDict(fileName);
                this.fileMessages.isuploaded = true;
                this.fileMessages.message = 'file uploaded';

                res.json(this.dictionaryService.findAllDictionaries());
            } catch (error) {
                this.fileMessages.isuploaded = false;
                this.fileMessages.message = 'error is on the server side, contact administrator';
                res.json(this.fileMessages);
            }
        });

        // ============== get All dictionaries ===================================
        this.router.get('/findAll', async (req: Request, res: Response) => {
            const dictionaries: TitleDescriptionOfDictionary[] = this.dictionaryService.findAllDictionaries();
            res.json(dictionaries);
        });
        this.router.get('/getDictionary/:name', async (req: Request, res: Response) => {
            const dictionaries = this.dictionaryService.getDictionary(req.params.name);
            res.json(dictionaries);
        });
        this.router.delete('/delete/:title', async (req: Request, res: Response) => {
            const title = req.params.title;
            const rep = this.dictionaryService.deleteDictionary(title);
            res.json(rep);
        });
    }
}
