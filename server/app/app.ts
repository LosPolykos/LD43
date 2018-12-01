import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import * as path from 'path';

import { Routes } from './routes';
import Types from './types';

@injectable()
export class Application {
    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(
        @inject(Types.Routes) private api: Routes,
    ) {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../client')));
        this.app.use(cors());
    }

    public routes(): void {
        const router: express.Router = express.Router();

        router.use(this.api.routes);
        this.app.use(router);
        this.errorHandeling();
    }

    private initNotFoundHandling(): void {
        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });
    }

    private initProdErrorHandler(): void {
        // no stacktraces leaked to user (in production env only)
        this.app.use((
            // tslint:disable-next-line:no-any
            err: any,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }

    private initDevErrorHandler(): void {
        this.app.use((
            // tslint:disable-next-line:no-any
            err: any,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: err,
            });
        });
    }

    private errorHandeling(): void {
        this.initNotFoundHandling();

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.initDevErrorHandler();
        }

        // production error handler
        this.initProdErrorHandler();
    }
}
