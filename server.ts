import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { seedDatabase } from './src/db/seed.ts';
import { requireAuth, requireAdmin, AuthRequest } from './src/middleware/auth.ts';
import {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
  getHolidays,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getAdsPositions,
  updateAdPosition
} from './src/db/queries.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // Attempt database seeding on startup
  try {
    await seedDatabase();
  } catch (seedError) {
    console.error("Database seeding on startup failed:", seedError);
  }

  // ---------------------------------------------------------------------------
  // SEO Routes
  // ---------------------------------------------------------------------------

  // Serve robots.txt dynamically
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    res.send(`User-agent: *\nAllow: /\nSitemap: ${appUrl}/sitemap.xml`);
  });

  // Serve sitemap.xml dynamically
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const allCountries = await getCountries();
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Home Page
      xml += `  <url>\n    <loc>${appUrl}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
      
      // Country public holiday pages (SEO friendly paths)
      for (const country of allCountries) {
        const slug = `${country.countryName.toLowerCase().replace(/\s+/g, '-')}-public-holidays`;
        xml += `  <url>\n    <loc>${appUrl}/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }
      
      // Dynamic holiday pages
      try {
        const allHolidays = await getHolidays();
        for (const h of allHolidays) {
          xml += `  <url>\n    <loc>${appUrl}/holiday/${h.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
        }
      } catch (e) {
        console.error("Sitemap holidays query failed:", e);
      }
      
      xml += `</urlset>`;
      res.type('application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap.xml:", error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // ---------------------------------------------------------------------------
  // API Routes
  // ---------------------------------------------------------------------------

  // 1. Countries API
  app.get('/api/countries', async (req, res) => {
    try {
      const list = await getCountries();
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/countries/:id', async (req, res) => {
    try {
      const c = await getCountryById(Number(req.params.id));
      if (!c) return res.status(404).json({ error: 'Country not found' });
      res.json(c);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/countries', requireAdmin, async (req, res) => {
    try {
      const newCountry = await createCountry(req.body);
      res.status(201).json(newCountry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/countries/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await updateCountry(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: 'Country not found' });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/countries/:id', requireAdmin, async (req, res) => {
    try {
      const deleted = await deleteCountry(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Country not found' });
      res.json({ message: 'Country deleted successfully', country: deleted });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2. Holidays API
  app.get('/api/holidays', async (req, res) => {
    try {
      const { countryId, countryName, month, year, type, search } = req.query;
      const filters = {
        countryId: countryId ? Number(countryId) : undefined,
        countryName: countryName ? String(countryName) : undefined,
        month: month ? String(month) : undefined,
        year: year ? Number(year) : undefined,
        type: type ? String(type) : undefined,
        search: search ? String(search) : undefined,
      };
      const list = await getHolidays(filters);
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/holidays/:id', async (req, res) => {
    try {
      const h = await getHolidayById(Number(req.params.id));
      if (!h) return res.status(404).json({ error: 'Holiday not found' });
      res.json(h);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/holidays', requireAdmin, async (req, res) => {
    try {
      const newHoliday = await createHoliday(req.body);
      res.status(201).json(newHoliday);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/holidays/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await updateHoliday(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: 'Holiday not found' });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/holidays/:id', requireAdmin, async (req, res) => {
    try {
      const deleted = await deleteHoliday(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: 'Holiday not found' });
      res.json({ message: 'Holiday deleted successfully', holiday: deleted });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Google Ads Positions API
  app.get('/api/ads-positions', async (req, res) => {
    try {
      const list = await getAdsPositions();
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/ads-positions/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await updateAdPosition(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: 'Ad position configuration not found' });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Current user status API
  app.get('/api/me', requireAuth, (req: AuthRequest, res) => {
    res.json({
      uid: req.user?.uid,
      email: req.user?.email,
      role: req.user?.dbRole,
    });
  });

  // ---------------------------------------------------------------------------
  // Frontend Asset Delivery
  // ---------------------------------------------------------------------------

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
