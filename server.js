import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_FOLDER = path.join(__dirname, 'uploads');

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
        const { name, content } = data;

        const filePath = path.join(UPLOADS_FOLDER, name);
        fs.writeFile(filePath, content, (err) => {
            if (err) console.error('Error saving file:', err);
            else socket.emit('file', { mensaje: 'File saved successfully' });
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started at localhost:${PORT}`);
});
