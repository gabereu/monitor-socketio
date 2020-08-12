# Monitor Socketio

Monitor Socketio is a package to monitor your socketio server

## Monitoring Interface

Use our [monitoring interface](https://github.com/gabereu/web-monitor-socketio).

## Install

```bash
npm install monitor-socketio
```

## Usage

```js
import Server from 'socket.io';
import { Monitor } from 'monitor-socketio';

const io = new Server(3333);

const monitor = new Monitor();

monitor.watch(io);

```

Monitor will emit messages from you socketio server or using a custom server. You can use web-monitor-socketio for better monitoring your socketio server.

## Using a custom server

```js
import Server from 'socket.io';
import { Monitor } from 'monitor-socketio';

const io = new Server(3333);

const monitorServer = new Server(4444);

const monitor = new Monitor(monitorServer);

monitor.watch(io);

```

## Emit a Monitor Message

```js

import Server from 'socket.io';
import { Monitor } from 'monitor-socketio';

const io = new Server(3333);

const monitor = new Monitor();

monitor.watch(io);

io.on('connect', socket=>{
    monitor.emit('conneted', socket.id)
});

```

## License
[MIT](https://github.com/gabereu/monitor-socketio/blob/master/LICENSE)
