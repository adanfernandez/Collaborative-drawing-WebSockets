import { Router, Request, Response} from 'express';
import Server from '../model/server';
import { usuariosConectados, } from '../sockets/socket';

export const router = Router();


router.get('/dibujo', (req: Request, res: Response) => {
    res.json("Testing get");
});


export default router;