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
            io.of('/monitor').emit('Connected', socket.id);
            socket.use((packet, next)=>{
                const received = {
                    from: socket.id,
                    data: packet,
                }
                io.of('/monitor').emit('received', received);
                next();
            });
            var emit = socket.emit;
            socket.emit = function() {
                const emitted ={
                    to: socket.id,
                    data: Array.prototype.slice.call(arguments)
                }

                io.of('/monitor').emit('emitted', emitted);
                return emit.apply(socket, arguments as any);
            };

            next();
        });

        io.of('/monitor').on('connect', socket => {
            // console.log('monitor: ', socket.id);
            socket.on('getSockets', (namespace, callback)=>{
                const sockets = over(server.of(namespace).sockets).reduce((previus, _socket, key)=> {
                    previus.push({
                        id: key
                    });
                    return previus;
                }, [] as unknown as [{}]);

                callback(sockets);
            })
        });
    }

    emit(name: string, ...data: any[]){
        this.io?.of('/monitor').emit('monitoremitted', name, ...data);
    }
}