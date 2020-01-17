const mongoosee = require('mongoose');
const PointSchema = require('./utils/pointSchema');



const devSchema = new mongoosee.Schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dSphere'
    }

});

module.exports = mongoosee.model('Dev', devSchema);