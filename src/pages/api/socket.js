import { Server } from 'socket.io';
import dbConnect from '../../lib/mongoose';
import Leaderboard from '../../models/Leaderboard';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('a user connected');

      const sendLeaderboardUpdate = async () => {
        await dbConnect();
        const leaderboard = await Leaderboard.find({}).sort({ score: -1 }).populate('user');
        socket.emit('leaderboardUpdate', leaderboard);
      };

      // Kirim pembaruan saat koneksi awal
      sendLeaderboardUpdate();

      // Atur interval untuk mengirim pembaruan
      const interval = setInterval(sendLeaderboardUpdate, 5000); // Kirim pembaruan setiap 5 detik

      socket.on('disconnect', () => {
        console.log('user disconnected');
        clearInterval(interval);
      });
    });
  }
  res.end();
};

export default SocketHandler;
