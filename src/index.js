require('./db/mongoose.js')
const TimeSlot = require('./models/timeSlot.js')
const express = require('express')
const Reservation = require('./models/reservation.js')
const moment = require('moment-timezone')

//app intialization
const app = express()
app.use(express.json())
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
app.get('/', (req, res) => {
    
})
app.post('/', async (req, res) => {
    
    const timeSlot = new TimeSlot(req.body);
    try{
        console.log(req.body)
        
        await timeSlot.save()
        res.send(timeSlot);
    } catch(e) {
        res.status(400).send({
            e,
            message:'error'
        })
    }
})

app.post('/reserve/:location', async(req, res) => {
    const location = req.params.location
    
    let day = moment(new Date(req.body.dateTime)).tz('Africa/Cairo').format('dddd');
    
    day = day.toLowerCase()
    try {
        const timeSlot = await TimeSlot.findOne({day,location})
        if(!timeSlot){
            return res.status(404).send()
        }
        const reservation = new Reservation({
            dateTime: moment(req.body.dateTime).tz('Africa/Cairo').format(),
            timeReference: timeSlot._id
        })
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
        await reservation.addToCalender(req.body.email,url)
        await reservation.sendWelcomeEmail(req.body.email)
        await reservation.save()
        res.send(reservation);
    } catch(e) {
        res.status(500).send(e)
    }
})
app.delete('/reservations/:id', async(req, res) => {
    try{
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).send();
        }
        await reservation.remove();
        res.send()
    } catch(e) {
        res.status(500).send();
    }
})
app.get('/reservations/:location', async(req ,res) => {
    const location = req.params.location
    const allDays = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    try{
        const timeSlots = await TimeSlot.find({location})
        if(timeSlots.length === 0){
            return res.status(404).send()
        }
        const availableDays = timeSlots.map(timeSlot => timeSlot.day)
        
        //Get timeSlots 
        let availableSlots = {};
        for(let i = 0; i< timeSlots.length ; i++){
            await timeSlots[i].populate('reservations').execPopulate()
            availableSlots[timeSlots[i].day] = timeSlots[i].time
        }
        //Get disabledTimeslots
        let disabledTimeslots = []
        timeSlots.forEach((timeSlot) => {
            timeSlot.reservations.forEach((time) => {
                let reserved ={ format: "MMMM Do YYYY, h:mm:ss A"}
                reserved.startDate = moment(time.dateTime).tz("Africa/Cairo").format("MMMM Do YYYY, h:mm:ss A")
                disabledTimeslots.push(reserved)
            })
        })
        //Get Days that have no training
        const ignoreDays={}; 
        console.log(disabledTimeslots)
        allDays.forEach((day) => {
            if(!availableDays.includes(day)){
                ignoreDays[day]=false
            }
        })
        res.send({ignoreDays, disabledTimeslots, timeslots: availableSlots})
        
    } catch(e) {

    }
})

app.listen(process.env.PORT)

