import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { db } from '../config/firebase.js';

interface VisitorInfo {
  ip: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  timestamp: string;
}

export const logVisitor = async (req: Request, res: Response): Promise<void> => {
  if (!db) {
    res.status(503).json({ error: 'Firestore not initialized' })
    return
  }

  try {
    let ipHeader = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    let ip = '';
    if (Array.isArray(ipHeader)) {
      ip = ipHeader[0].split(',')[0].trim();
    } else if (typeof ipHeader === 'string') {
      ip = ipHeader.split(',')[0].trim();
    }
    
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    const visitorsRef = db.collection('visitors');
    
    // Check if IP already exists
    const existingSnapshot = await visitorsRef.where('ip', '==', ip).limit(1).get();
    
    if (!existingSnapshot.empty) {
      const doc = existingSnapshot.docs[0];
      await visitorsRef.doc(doc.id).update({
        timestamp: new Date().toISOString()
      });
      res.status(200).json({ success: true, message: 'Updated existing visitor' });
      return;
    }

    if (ip && ip !== '::1' && ip !== '127.0.0.1') {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const geo = await response.json() as any;

      if (geo && geo.status === 'success') {
        const newVisitor: VisitorInfo = {
          ip,
          country: geo.country,
          city: geo.city,
          lat: geo.lat,
          lon: geo.lon,
          timestamp: new Date().toISOString()
        };
        await visitorsRef.add(newVisitor);
      }
    } else if (ip === '::1' || ip === '127.0.0.1') {
      const newVisitor: VisitorInfo = {
        ip: '127.0.0.1',
        country: 'Localhost',
        city: 'Local',
        lat: 0,
        lon: 0,
        timestamp: new Date().toISOString()
      };
      await visitorsRef.add(newVisitor);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error logging visitor:', error);
    res.status(500).json({ error: 'Failed to log visitor' });
  }
};

export const getVisitors = async (_req: Request, res: Response): Promise<void> => {
  if (!db) {
    res.status(503).json({ error: 'Firestore not initialized' })
    return
  }

  try {
    const snapshot = await db.collection('visitors').get();
    const visitors = snapshot.docs.map(doc => doc.data() as VisitorInfo);
    
    const countryCounts = visitors.reduce((acc, curr) => {
      acc[curr.country] = (acc[curr.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({
      total: visitors.length,
      countries: Object.keys(countryCounts).length,
      countryStats: countryCounts,
      locations: visitors.map(v => ({ lat: v.lat, lon: v.lon, city: v.city, country: v.country }))
    });
  } catch (error) {
    console.error('Error fetching visitors from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
};
