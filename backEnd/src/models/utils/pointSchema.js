const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const pointSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: ['point'],
        require:true,
    },
    coodinates:{
        type:[Number],
        require:true,
    }
});

module.exports = pointSchema;