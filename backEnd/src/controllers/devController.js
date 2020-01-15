const axios = require('axios');
const Dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');


module.exports = {
    //delete user
    async delete(req,res){
        const {github_username} = req.params;
        //check if user exist
        let dev = await Dev.findOne({github_username});
        if(dev){
            await Dev.deleteOne({_id:dev._id});
            
            return res.json({message:"ok"});
        }else{
            return res.json({message:"dev not found"});
        }
    },

    //update dev informations
    async update(req,res){
        const{github_username} = req.params;

        //check if dev exist
        let dev = await Dev.findOne({github_username});
        
        if(dev){
            //get user data from github
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            let {git_name = github_username, git_avatar_url, git_bio} = apiResponse.data;

            //set github data as default for some data
            const{
                name = git_name,
                avatar_url = git_avatar_url,
                bio = git_bio,
                latitude,
                longitude,
                techs
            } = req.body;

            //check if had new techs
            const techsArray = techs ? parseStringAsArray(techs): undefined;
            
            const location = {
                type: 'point',
                coodinates:[longitude, latitude]
            };
            
            await dev.updateOne({
                name,
                avatar_url,
                bio,
                location,
                techs:techsArray
            });
            
            // old version 
            // if(name) dev.name = name;
            // if(longitude !== undefined && latitude!==undefined) dev.location = location;
            // if(bio) dev.bio = bio;
            // if(techsArray) dev.techs = techsArray;
            // if(avatar_url)dev.avatar_url = avatar_url;
            await dev.save();

            return res.json({message:"ok"});

        }else{

            return res.json({message:"dev not found"});
        }
        
        
    },

    //get all devs
    async index(req,res){
        const devs = await Dev.find();
        return res.json(devs);
    },

    //create a new dev
    async store(req,res){
        
        const {github_username, techs, latitude, longitude} = req.body;

        //check if already exist this dev
        let dev = await Dev.findOne({github_username});
        
        if(!dev){
            //get user data from gitHub api
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
            let {name = login, avatar_url, bio} = response.data;
            if(!name) name = response.data.login;
            
            
            //convert the string into an array of strings
            const techsarray = parseStringAsArray(techs);
            
            const location = {
                type: 'point',
                coodinates:[longitude, latitude]
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsarray,
                location
            });
        
            
            return res.json({message:"new user created"});
        }else{
            return res.json({message:"user already exist"});
        }
    
    }
    
};