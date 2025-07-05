require('dotenv').config();
const sendWebhook = require('./utils/webhookLogger');

const embed = {
  title: '🎯 Get Your Roles',
  description: 'Select a role from the dropdown in this channel to gain access!\n\n- Trusted Bot\n- Bot\n- Server Admin\n- Head Moderator\n- Moderator\n- Announcer\n- Verified Member\n- Designer\n- Beta Tester\n- 404! User NoAccess\n- Muted\n- Timeout',
  color: 0x00AE86,
  footer: { text: 'XShield Bot' },
  timestamp: new Date().toISOString()
};

sendWebhook(process.env.WEBHOOK_URL, '', { embeds: [embed] });
