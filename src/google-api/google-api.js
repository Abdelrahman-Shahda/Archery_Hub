const {google} = require('googleapis')

const {OAuth2} = google.auth

const oAuth2Client = new OAuth2(process.env.CALENDAR_CLIENT_ID, process.env.CALENDAR_CLIENT_SECRET)

oAuth2Client.setCredentials({
  refresh_token:process.env.CALENDAR_REFRESH_TOKEN
})

const calendar = google.calendar({version: 'v3' ,auth: oAuth2Client})

module.exports = calendar 