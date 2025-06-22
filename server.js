import { Server } from 'socket.io';
import express from 'express';
import * as http from 'http';
import ViteExpress from 'vite-express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    //크로스오리진 이슈 해결
    cors: {
        origin: "*"
    }
});

io.on('connection', (client) => {
    const connectedUsername = client.handshake.query.username;
    console.log(`사용자 접속했습니다. ${connectedUsername}`);
    //console.log(client.handshake.query.username);

    client.broadcast.emit('new message', {username: '관리자', message: `[${connectedUsername}]님 입장!`});

    client.on('new message', (msg) => {
        //console.log(`new msg : ${msg}`);
        console.log(msg);
        io.emit('new message', {username: msg.username, message: msg.message});
    });

    client.on('disconnect', () => {
        console.log(`사용자 접속 종료...${connectedUsername}`);
        io.emit('new message', {username: '관리자', message: `[${connectedUsername}]님 퇴장!`});
    });
});
server.listen(3000, () => {
    console.log('서버 리슨~');
});

app.get('/message', (_, res) => res.send('Hello from express'));

app.get('/api', (_, res) => {
    res.send('Hello from api')
});

ViteExpress.bind(app, server);
