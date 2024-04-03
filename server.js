import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import fs from 'fs';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const UPLOADS_FOLDER = path.join(path.dirname(import.meta.url), 'uploads');

app.use(express.static(path.join(path.dirname(import.meta.url), 'public')));

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('message', (data) => {
        console.log('Message received:', data);
        socket.emit('message', { mensaje: 'Message received' });
    });

    socket.on('file', (data) => {
        const { nombre, tipo, contenido } = data;
        const filePath = path.join(UPLOADS_FOLDER, nombre);

        fs.writeFile(filePath, contenido, 'binary', (err) => {
            if (err) {
                console.error('Error trying to save the file:', err);
                socket.emit('error', { mensaje: 'Error trying to save the file at server' });
            } else {
                console.log('File saved succesfully:', nombre);
                socket.emit('success', { mensaje: 'File saved succesfully' });
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started at localhost:${PORT}`);
});
