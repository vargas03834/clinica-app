const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

module.exports = async (to, body) => {
  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_NUMBER}`,
    to: `whatsapp:${to}`,
    body,
  });
};