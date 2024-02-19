const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Simpan informasi tentang setiap koneksi
const users = [];
let peserta = ["peserta1", "peserta2", "peserta3", "peserta4", "peserta5"]
let i = 0
io.on('connection', (socket) => {

    let b = peserta[i]
    users.push({ id: socket.id, b });

    console.log(users)
    console.log(`${users[i].b} connected`);
    i+=1

    // // Tambahkan informasi tentang koneksi ke dalam objek 'users'
    // users[b] = {
    //     socket: socket,
    //     username: b // Anda bisa menambahkan properti lain jika diperlukan
    // };
 

    //console.log(users)

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

module.exports = users