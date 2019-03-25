

const express=  require('express');
const router = express.Router();
const Pusher = require('pusher');

const mongoose = require('mongoose');
const Vote = require('../models/Vote');

var pusher = new Pusher({
    appId: '470669',
    key: 'ed0e7d30722b39bd2721',
    secret: '6927195bd30abff44366',
    cluster: 'ap2',
    encrypted: true
  });


router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({success: true, votes:votes}));
});

router.post('/',  (req, res) =>{

    const newVote ={
        os:req.body.os,
        points:1
    }

    new Vote(newVote).save().then(vote=>{

        pusher.trigger('os-poll', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
    
          });
    
          return res.json({success:true, message:'Thank you for voting'});
    

    });    
});

module.exports = router;