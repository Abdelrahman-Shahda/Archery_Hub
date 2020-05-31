const mongoose = require('mongoose')
const moment = require('moment-timezone')
const calendar = require('../google-api/google-api.js')
const gmail = require('../google-api/gmail.js')
const reservationSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        required:true
    },
    timeReference:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: true
    }
})

reservationSchema.methods.sendWelcomeEmail =  async function (email) {
    const reservation = this;
    
    
    try{
        const time = moment(reservation.dateTime).tz("Africa/Cairo").format("MMMM Do YYYY, h:mm:ss A")
        let message = new Buffer('From:Archery_Hub<abdoshahda2000@gmail.com>\r\n'+
        `To:${email}\r\nSubject:Test\r\n\r\n A new reservation is schedule at ${time} and it was added to ur  calender`).toString('base64')
        console.log(time);
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
            raw:message  
            }
        
    })
        return 
    } catch(e) {
        throw(e)
    }
}
reservationSchema.methods.addToCalender = async function(email, url) {
    const reservation = this;
    const sentUrl = `${url}/${reservation._id}`;
    const endTime = moment(reservation.dateTime).add(1,'hours');
    
    try{
             
        
    const response = await calendar.events.insert({
        calendarId:'primary',
        sendUpdates:'all',
        requestBody:{
            summary:'Archery_hub',
            description:`to cancel click this url ${url}`,
            guestsCanModify: true,
            end:{
                dateTime:endTime,
            },
            start:{
                dateTime:reservation.dateTime,
            },
            attendees: [{
                email
            }]
        }
    })

    return console.log('done')

} catch(e) {
    throw(e)
}
}
module.exports = mongoose.model('Reservation', reservationSchema)