import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';


export default class Server {
    
    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);

        this.escucharSockets();
    }


    public static get instance() {
        return this._instance || (this._instance = new this());
    }


    private escucharSockets() {
        console.log('Escuchando conexiones - sockets');

        // On: Escuchar algún evento.
        debugger;
        this.io.on('connect', cliente => {

            // Conectar cliente
            socket.conectarCliente(cliente, this.io);
            
            // Desconectar
            socket.desconectar(cliente, this.io);

            // Pintar
            socket.pintar(cliente, this.io);

            // Usuarios activos
            socket.usuariosActivos(cliente, this.io);
            
        });
    }

    start(callback: () => void) {
        this.httpServer.listen(this.port, callback);
    }    
}