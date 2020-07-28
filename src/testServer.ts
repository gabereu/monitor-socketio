import Server from 'socket.io';
import { Monitor } from './index';

const io = new Server(3000);

const monitor = new Monitor();

monitor.watch(io);

io.on('connect', socket=>{
    console.log('hey: ', socket.id);
    monitor.emit('conneted', socket.id)
    socket.emit('hello');
    socket.on('disconnect', ()=>{
        console.log('disconnected: ', socket.id);
    });
})