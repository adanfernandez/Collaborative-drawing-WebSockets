import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../model/usuarios-lista';
import { Usuario } from '../model/usuario';


export const usuariosConectados = new UsuariosLista();
export let shapes = [];

export const desconectar = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuarios(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
        if(!usuariosConectados.getLista().length) {
            shapes = [];
        }
    });
}

export const conectarCliente = (cliente: Socket, io: SocketIO.Server) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

export const pintar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('dibujar', function incoming(message) {
        shapes = message;
        cliente.broadcast.emit('get-dibujo', message);
    });
}

export const usuariosActivos = (cliente: Socket, io: socketIO.Server) => {
    io.emit('usuarios-activos', usuariosConectados.getLista());
}