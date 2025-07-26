import dbConnect from '../../../lib/mongoose';
import Leaderboard from '../../../models/Leaderboard';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const leaderboard = await Leaderboard.find({}).sort({ score: -1 }).populate('user');
        res.status(200).json({ success: true, data: leaderboard });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
