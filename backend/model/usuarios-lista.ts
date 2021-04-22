import { Usuario } from './usuario';

export class UsuariosLista {
    private lista: Usuario[] = [];

    constructor() { }

    /**
     * Agregar un usuario
     * @param usuario 
     */
    public agregar(usuario: Usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }

    /**
     * Actualizar nombre de un usuario por medio de su id
     * @param id 
     * @param nombre 
     */
    public actualizarNombre(id: string, nombre: string) {
        for(let usuario of this.lista) {
            if (usuario.id === id) {
                usuario.nombre = nombre;
                break;
            }
        }
        console.log('====== Actualizando usuario ======');
        console.log(this.lista);
    }

    /**
     * Obtener lista de usuarios
     */
    public getLista() {
        return this.lista.filter(usuario => {
            return usuario.nombre != 'sin-nombre'
        });
    }

    /**
     * Obtener un usuario por su id
     * @param id
     */
    public getUsuario(id: string) {
        return this.lista.find(usuario => usuario.id === id );
    }

    /**
     * Obtener usuario en una sala en particular
     */
    public getUsuariosEnSala(sala: string) {
        return this.lista.filter(usuario => usuario.sala === sala);
    }

    /**
     * Borrar usuario por id
     */
    public borrarUsuarios(id: string) {
        const tempUsuario = this.getUsuario(id);
        this.lista = this.lista.filter(usuario => usuario.id !== id);
        return tempUsuario;
    }
}