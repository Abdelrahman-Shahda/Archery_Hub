const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/archery_hub', {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true
})