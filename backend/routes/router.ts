import { Router, Request, Response} from 'express';
import Server from '../model/server';
import { shapes, usuariosConectados, } from '../sockets/socket';

export const router = Router();


router.get('/dibujo', (req: Request, res: Response) => {;
    res.send(shapes);
});


export default router;