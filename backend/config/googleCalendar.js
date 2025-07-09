const { google } = require('googleapis');
const calendar = google.calendar('v3');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const createGoogleCalendarEvent = async (event) => {
  return await calendar.events.insert({
    auth: oAuth2Client,
    calendarId: 'primary',
    resource: event,
  });
};

module.exports = { createGoogleCalendarEvent };