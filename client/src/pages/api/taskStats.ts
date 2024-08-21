import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'indexer';
const COLLECTION_NAME = 'events';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    const eventsCollection = db.collection(COLLECTION_NAME);

    // Total number of tasks posted
    const totalTasks = await eventsCollection.countDocuments({name: 'TaskPosted'});

    // Total number of submissions made
    const totalSubmissions = await eventsCollection.countDocuments({ name: 'SubmissionMade' });

    // Total rewards distributed
    const winnerEvents = await eventsCollection.find({ name: 'WinnerSelected' }).toArray();
    const totalRewards = winnerEvents.reduce((sum, event) => {
      const rewardArg = event.args.find((arg: any) => arg.key === 'reward');
      const reward = rewardArg ? parseInt(rewardArg.value._hex, 16) : 0;
      return sum + reward;
    }, 0);
    client.close();

    res.status(200).json({
      totalTasks,
      totalSubmissions,
      totalRewards,
    });
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
};

export default handler;
