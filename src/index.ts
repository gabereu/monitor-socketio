import { Server } from 'socket.io';
import over from 'over-object';

export class Monitor{
    io?: Server;
    monitoring?: Server;

    constructor(server?: Server){
        if(server){
            this.io = server;
        }
    }

    watch(server: Server){
        if(!this.io){
            this.io = server;
        }
        this.monitoring = server;

        const io = this.io;

        server.use((socket, next)=>{

            io.of('/monitor').emit('Connected', {
                id: socket.id,
                namespace: socket.nsp.name,
                rooms: socket.rooms,
            });

            socket.use((packet, next)=>{
                const received = {
                    from: {
                        id: socket.id,
                        namespace: socket.nsp.name,
                        rooms: socket.rooms,
                    },
                    data: packet,
                }
                io.of('/monitor').emit('Received', received);
                next();
            });

            var emit = socket.emit;
            socket.emit = function() {
                const emitted ={
                    to: {
                        id: socket.id,
                        namespace: socket.nsp.name,
                        rooms: socket.rooms,
                    },
                    data: Array.prototype.slice.call(arguments)
                }
                console.log('emitted', Object.keys(socket.rooms))
                io.of('/monitor').emit('Emitted', emitted);
                return emit.apply(socket, arguments as any);
            };

            next();
        });

        io.of('/monitor').on('connect', socket => {
            socket.on('getSockets', (namespace, callback)=>{
                const sockets = over(server.of(namespace).sockets).reduce((previus, _socket, key)=> {
                    previus.push({
                        id: key,
                        namespace: _socket.nsp.name,
                        rooms: _socket.rooms,
                    });
                    return previus;
                }, [] as unknown as [{}]);

                callback(sockets);
            })
        });
    }

    emit(name: string, ...data: any[]){
        this.io?.of('/monitor').emit('Monitoremitted', name, ...data);
    }
}