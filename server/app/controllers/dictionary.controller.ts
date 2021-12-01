/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-deprecated */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable prettier/prettier */
import { TitleDescriptionOfDictionary } from '@app/models/titleDescriptionOfDictionary.model';
import { DictionaryService } from '@app/services/dictionary.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { FileMessages } from './../models/file-messages.model';

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
        const multer = require('multer');
        const storage = multer.diskStorage({
            destination: (req: Request, file: File, cb: (arg0: null, arg1: string) => void) => {
                cb(null, './app/assets/');
            },
            filename: (req: any, file: { originalname: any }, cb: (arg0: null, arg1: string) => void) => {
                cb(null, `${file.originalname}`);
                // setTimeout(() => {
                fileName = file.originalname;
                // }, 1000);
            },
        });
        const upload = multer({ storage });
        this.router.post('/addNewDictionary', upload.single('file'), async (req: Request, res: Response) => {
            try {
                await this.dictionaryService.addDict(fileName);
                this.fileMessages.isuploaded = true;
                this.fileMessages.message = 'file uploaded';

                res.json(this.dictionaryService.findAllDictionaries()); // ('{isuploaded:true, message:"file uploaded"}');
            } catch (error) {
                this.fileMessages.isuploaded = false;
                this.fileMessages.message = 'error is on the server side, contact administrator';
                res.json(this.fileMessages);
            }
        });

        // ============== get All dictionaries ===================================
        this.router.get('/findAll', async (req: Request, res: Response) => {
            try {
                // Disable caching for content files
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                const dictionaries: TitleDescriptionOfDictionary[] = this.dictionaryService.findAllDictionaries();
                console.log('=====> list in server : ' + JSON.stringify(dictionaries));
                res.json(dictionaries);
            } catch (error) {
                res.status(StatusCodes.SERVICE_UNAVAILABLE).send(error.message);
            }
        });
        this.router.delete('/delete/:title', async (req: Request, res: Response) => {
            const title = req.params.title;
            const rep = this.dictionaryService.deleteFile(title);
            res.json(rep);
        });
    }
}
