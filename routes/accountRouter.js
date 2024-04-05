const express = require('express');
const authMiddleware = require('../middleware');
const { default: mongoose } = require('mongoose');
const AccountModel = require('../models/Account')
const router = express.Router();



router.get("/getAccountBalance",authMiddleware,async (req,res)=>{
   const account = await AccountModel.findOne({userId:req.query.userId})
   res.json(
         {
              balance:account.balance
         }
   )
})

router.post('/transfer',authMiddleware,async (req,res)=>{
    // create the session
  const session = await mongoose.startSession()
   //   start the transaction
  session.startTransaction()

  // do transactions
  const {to,amount} = req.body

  const account = await AccountModel.findOne({userId:req.userId}).session(session)

  if(!account || account.balance<amount){
    await session.abortTransaction()
      res.json({
          message:"Insufficient Balance"
      })
      return
  }
  
  const toAccount = await AccountModel.findOne({userId:to}).session(session)


  if(!toAccount){
    await session.abortTransaction()
      res.json({
          message:" Invalid account"
      })
      return
  }


    await AccountModel.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session)
    await AccountModel.updateOne({userId:to},{$inc:{balance:amount}}).session(session)

    await session.commitTransaction()
    res.json({
        message:"Transfer Successful"
    })

})


module.exports = router;
