import express from 'express';
import ical from 'node-ical';

const app = express();
app.use(express.json({ limit: '5mb' }));

app.post('/parse', async (req, res) => {
  const { ical_data } = req.body;
  try {
    const events = ical.parseICS(ical_data);
    const formatted = Object.values(events)
      .filter(event => event.type === 'VEVENT')
      .map(event => ({
        uid: event.uid || null,
        summary: event.summary || null,
        dtstart: event.start || null,
        dtend: event.end || null
      }));
    res.json({ data: formatted });
  } catch (err) {
    res.status(400).json({ error: 'Parse failed', message: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`iCal parser running on port ${port}`);
});
