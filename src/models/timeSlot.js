const mongoose = require('mongoose')

const TimeSlotSchema = new mongoose.Schema({
    day:{
        type: String,
        required: true,
        enum: ['monday', 'sunday', 'tuesday', 'wednesday', 'thursday', 'saturday', 'friday']
    },
    time: [[{
        type: String,
        required:true
    }, {
        type: String,
    }]]
    ,
    location: {
        type: String,
        required: true
    }

})
TimeSlotSchema.virtual('reservations',{
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'timeReference'
})
TimeSlotSchema.pre('save' , async function(next) {
    const timeSlot = this

    //check if start time is less than endTime
    if(timeSlot.time[timeSlot.time.length-1][0]>timeSlot.time[timeSlot.time.length-1][1])
    {
        throw new Error()
    }
    next()
})
TimeSlotSchema.index({day: 1, location: 1}, {unique: true})
module.exports = mongoose.model('TimeSlot', TimeSlotSchema)