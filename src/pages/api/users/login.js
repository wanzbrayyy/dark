import dbConnect from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan' });
      }

      // Di aplikasi nyata, Anda harus membandingkan hash kata sandi
      if (user.password !== password) {
        return res.status(401).json({ success: false, error: 'Kata sandi salah' });
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Metode tidak diizinkan' });
  }
}
