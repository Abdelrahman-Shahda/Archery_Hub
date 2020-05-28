const {google} = require('googleapis')

const {OAuth2} = google.auth

const oAuth2Client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET)

oAuth2Client.setCredentials({
  refresh_token:process.env.GMAIL_REFRESH_TOKEN
})

const gmail = google.gmail({version:'v1',auth:oAuth2Client })

module.exports = gmail