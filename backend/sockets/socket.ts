import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../model/usuarios-lista';
import { Usuario } from '../model/usuario';


export const usuariosConectados = new UsuariosLista();
export let shapes = [];

export const desconectar = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuarios(cliente.id);
        console.log("Desconectando - " + usuariosConectados.getLista().length + "\n\n");
        io.emit('usuarios-activos', usuariosConectados.getLista());
    });
}

export const conectarCliente = (cliente: Socket, io: SocketIO.Server) => {
        const usuario = new Usuario(cliente.id);
        usuariosConectados.agregar(usuario);
}


// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    // Este es el manejador del evento
    cliente.on('mensaje', (payload) => {
        io.emit('mensaje-nuevo', payload);
    });
}



// Configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    // Este es el manejador del evento
    cliente.on('configurar-usuario', (payload, callback: Function) => {
        
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);

        io.emit('usuarios-activos', usuariosConectados.getLista());

        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        })
    });
}

// Obtener usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', () => {
        // Con el to, emitimos a un usuario específico
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    });
}


export const pintar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('dibujar', function incoming(message) {
        shapes = message.canvas.objects;
        cliente.broadcast.emit('get-dibujo', message);
    });
}

export const usuariosActivos = (cliente: Socket, io: socketIO.Server) => {
    io.emit('usuarios-activos', usuariosConectados.getLista());
}