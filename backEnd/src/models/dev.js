const mongoosee = require('mongoose');
const pointSchema = require('./utils/pointSchema');



const devSchema = new mongoosee.Schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
        type: pointSchema,
        index: '2dSphere'
    }

});

module.exports = mongoosee.model('Dev', devSchema);