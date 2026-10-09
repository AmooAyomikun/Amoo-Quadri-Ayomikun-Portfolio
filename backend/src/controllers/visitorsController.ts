import { Request, Response } from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const visitorsFilePath = path.join(__dirname, '../data/visitors.json');

interface VisitorRecord {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
  timestamp: string;
}

// Read real visitors from disk file
const readVisitorsFromFile = (): VisitorRecord[] => {
  try {
    if (fs.existsSync(visitorsFilePath)) {
      const raw = fs.readFileSync(visitorsFilePath, 'utf8');
      return JSON.parse(raw) as VisitorRecord[];
    }
  } catch (err) {
    console.error('Error reading visitors.json:', err);
  }
  return [];
};

// Save real visitors to disk file
const saveVisitorsToFile = (visitors: VisitorRecord[]) => {
  try {
    fs.writeFileSync(visitorsFilePath, JSON.stringify(visitors, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving visitors.json:', err);
  }
};

export const logVisitor = async (req: Request, res: Response): Promise<void> => {
  try {
    let ipHeader = req.headers['x-forwarded-for'] || req.headers['cf-connecting-ip'] || req.socket.remoteAddress || '';
    let ip = '';
    if (Array.isArray(ipHeader)) {
      ip = ipHeader[0].split(',')[0].trim();
    } else if (typeof ipHeader === 'string') {
      ip = ipHeader.split(',')[0].trim();
    }
    
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    // Resolve public IP if on localhost
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      try {
        const publicIpRes = await fetch('https://api.ipify.org?format=json');
        if (publicIpRes.ok) {
          const publicIpJson = await publicIpRes.json() as any;
          if (publicIpJson && publicIpJson.ip) {
            ip = publicIpJson.ip;
          }
        }
      } catch (err) {
        // Fallback
      }
    }

    let geoData: any = null;
    if (ip && ip !== '::1' && ip !== '127.0.0.1') {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,lat,lon`);
        const geo = await geoRes.json() as any;
        if (geo && geo.status === 'success') {
          geoData = geo;
        }
      } catch (err) {
        console.error('Geo lookup error:', err);
      }
    }

    const country = geoData?.country || 'Nigeria';
    const countryCode = geoData?.countryCode || 'NG';
    const city = geoData?.city || 'Lagos';
    const lat = geoData?.lat || 6.5244;
    const lon = geoData?.lon || 3.3792;

    let visitors = readVisitorsFromFile();
    const existingIndex = visitors.findIndex(v => v.ip === ip || (v.country === country && v.city === city));

    if (existingIndex >= 0) {
      visitors[existingIndex].timestamp = new Date().toISOString();
      visitors[existingIndex].country = country;
      visitors[existingIndex].countryCode = countryCode;
      visitors[existingIndex].city = city;
      visitors[existingIndex].lat = lat;
      visitors[existingIndex].lon = lon;
    } else {
      visitors.push({
        ip,
        country,
        countryCode,
        city,
        lat,
        lon,
        timestamp: new Date().toISOString()
      });
    }

    saveVisitorsToFile(visitors);

    // Sync to Firestore if available
    if (db) {
      try {
        const visitorsRef = db.collection('visitors');
        const existingSnapshot = await visitorsRef.where('ip', '==', ip).limit(1).get();
        if (!existingSnapshot.empty) {
          await visitorsRef.doc(existingSnapshot.docs[0].id).update({
            timestamp: new Date().toISOString(),
            country,
            countryCode,
            city,
            lat,
            lon
          });
        } else {
          await visitorsRef.add({
            ip,
            country,
            countryCode,
            city,
            lat,
            lon,
            timestamp: new Date().toISOString()
          });
        }
        
        // Fetch full historical visitors from Firestore so the count is accurate
        const allSnapshot = await visitorsRef.get();
        if (!allSnapshot.empty) {
          visitors = allSnapshot.docs.map(doc => doc.data() as VisitorRecord);
        }
      } catch (dbErr) {
        console.error('Firestore sync error:', dbErr);
      }
    }

    // Compute REAL country counts from actual recorded visitors
    const countryStats: Record<string, number> = {};
    const countryCodeMap: Record<string, string> = {};

    visitors.forEach(v => {
      if (v.country) {
        countryStats[v.country] = (countryStats[v.country] || 0) + 1;
        if (v.countryCode) {
          countryCodeMap[v.country] = v.countryCode;
        }
      }
    });

    const topCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], index) => ({
        rank: index + 1,
        name: name.toUpperCase(),
        code: countryCodeMap[name] || 'UN',
        count
      }));

    const userCountryCount = countryStats[country] || 1;

    res.status(200).json({
      success: true,
      userCountry: country.toUpperCase(),
      userCountryCode: countryCode,
      userCity: city,
      userCountryCount,
      totalVisitors: visitors.length,
      topCountries,
      countryStats,
      locations: visitors.map(v => ({ lat: v.lat, lon: v.lon, city: v.city, country: v.country }))
    });
  } catch (error) {
    console.error('Error logging visitor:', error);
    res.status(500).json({ error: 'Failed to log visitor' });
  }
};

export const getVisitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    let visitors = readVisitorsFromFile();

    if (db) {
      try {
        const snapshot = await db.collection('visitors').get();
        if (!snapshot.empty) {
          visitors = snapshot.docs.map(doc => doc.data() as VisitorRecord);
        }
      } catch (err) {
        console.error('Firestore fetch error:', err);
      }
    }

    const countryStats: Record<string, number> = {};
    const countryCodeMap: Record<string, string> = {};

    visitors.forEach(v => {
      if (v.country) {
        countryStats[v.country] = (countryStats[v.country] || 0) + 1;
        if (v.countryCode) {
          countryCodeMap[v.country] = v.countryCode;
        }
      }
    });

    const topCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], index) => ({
        rank: index + 1,
        name: name.toUpperCase(),
        code: countryCodeMap[name] || 'UN',
        count
      }));

    res.status(200).json({
      total: visitors.length,
      countries: Object.keys(countryStats).length,
      countryStats,
      topCountries,
      locations: visitors.map(v => ({ lat: v.lat, lon: v.lon, city: v.city, country: v.country }))
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
};


