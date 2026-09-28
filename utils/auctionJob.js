const cron = require('node-cron');
const { finishAuctions } = require('../controllers/paintingController');

cron.schedule('* * * * *', async () => {
  try {
    await finishAuctions();
  } catch (err) {
    console.error('Auction check error:', err);
  }
});
