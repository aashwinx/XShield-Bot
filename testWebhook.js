require('dotenv').config();
const sendWebhook = require('./utils/webhookLogger');

sendWebhook(process.env.WEBHOOK_URL, 'Test message from XShield bot webhook!');
