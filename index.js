const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

const users = [];
let peserta = ["TIM 1", "TIM 2", "TIM 3", "TIM 4", "TIM 5"]
let i = 0
io.on('connection', (socket) => {

    let b = peserta[i]
    users.push({ id: socket.id, b });

    //console.log(users)
    console.log(`${users[i].b} connected`);
    i+=1

    // Handle ketika user mengirimkan event 'click'
    socket.on('click', () => {
        const user = users.find(u => u.id === socket.id);
        const userClicked = user.b
        console.log(userClicked)

        // Emit event 'clickEvent' kepada semua koneksi, termasuk pengirimnya
        io.emit('clickEvent', userClicked);
    });


    // Handle event ketika koneksi terputus
    socket.on('disconnect', () => {
        console.log('User disconnected');

        // Hapus informasi koneksi dari objek 'users'
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});