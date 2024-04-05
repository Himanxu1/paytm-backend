const mongoose = require('mongoose');

const AccoutSchema = new mongoose.Schema({
    userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref:'User'
      
    },
    balance:{
        type:Number
        
    }

})

const AccountModel = mongoose.model('Account', AccoutSchema);

module.exports = AccountModel
