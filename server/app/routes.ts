import { NextFunction, Request, Response, Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export class Routes {

    public get routes(): Router {
        const router: Router = Router();

        router.all('/', (req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Origin-Allow-Origin', '*');
            res.header('Access-Control-Origin-Allow-Headers', 'X-Requested-With');
            next();
        });

        router.get('/', (req: Request, res: Response, next: NextFunction) => console.warn('INDEX CALLED'));
        return router;
    }
}
