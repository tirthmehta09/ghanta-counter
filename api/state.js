import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const KEY = 'ghanta';
const EMPTY = { count: 0, played: 0, running: false };

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const s = (await redis.get(KEY)) || EMPTY;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(s);
  }

  if (req.method === 'POST') {
    const { count, played, running } = req.body || {};
    const s = {
      count: Number(count) || 0,
      played: Math.min(Number(played) || 0, 108),
      running: !!running
    };
    await redis.set(KEY, s);
    return res.status(200).json(s);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end();
}
