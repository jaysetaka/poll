const mongoose = require('mongoose');

//map global promises

mongoose.Promise = global.Promise;
//momgoose connnect
mongoose.connect('mongodb://jsetaka:Meditech17@ds125628.mlab.com:25628/pusherpoll')

.then(()=> console.log('MongoDB connected'))
.catch(err => console.log(err));