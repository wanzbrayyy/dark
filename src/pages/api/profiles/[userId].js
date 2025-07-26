import dbConnect from '../../../lib/mongoose';
import Profile from '../../../models/Profile';

export default async function handler(req, res) {
  const {
    query: { userId },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const profile = await Profile.findOne({ user: userId }).populate('user');
        if (!profile) {
          return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: profile });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const profile = await Profile.findOneAndUpdate({ user: userId }, req.body, {
          new: true,
          runValidators: true,
        });
        if (!profile) {
          return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: profile });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
