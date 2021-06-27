var express = require('express');
var router = express.Router();
const iyfg = require('../public/IYFG_token.js');
const walletDB = require('../public/walletDB.js')
const jwt = require('jsonwebtoken');

router.get('/', async function(req, res, next) {
  try{
    if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
  let token = req.headers.authorization.split(" ")[1];

  iyfg.getTokenDetails(token, (answer) => {
    res.json(answer);
  });
      }
      catch(e){
        console.log(e);
        res.json({res: e.toString()});
      }
  
});

  router.get('/getBalance', (req, res) => {
      try{
        if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
        let token = req.headers.authorization.split(" ")[1]
        let address = req.body.address;
        iyfg.getBalance(token,address, (answer) => {
        let account_balance = answer;
        res.json({"balance" : account_balance});
      });
      }catch(e){
        console.log(e);
        res.json({res: e.toString()});
      }
    
    });

    router.get('/getAllowance', (req, res) => {
      try{
        if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
        let token = req.headers.authorization.split(" ")[1]
        let owner = req.body.owner;
        let spender = req.body.spender;
        iyfg.getAllowance(token, owner, spender, (answer) => {
        let balance = answer;
        res.json({"allowed" : balance});
      });}catch(e) {
        console.log(e);
        res.json({res: e.toString()});
      }

    });

    router.post('/approve', (req, res) => {
      try{
        if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
        let token = req.headers.authorization.split(" ")[1]
        let spender = req.body.spender;
        let amount = req.body.amount;
        iyfg.approveToken(token, spender, amount,(result) => {
        res.json(result);
      });
    }catch(e){
      console.log(e);
        res.json({res: e.toString()});
    }
    });

    router.post('/transfer', (req, res) => {
     
      try{
        if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
        let token = req.headers.authorization.split(" ")[1]
      let recipient = req.body.recipient;
      let amount = req.body.amount;
      iyfg.transferToken(token,recipient, amount, (result) => {
        res.json(result);
      });
    }catch(e){
      console.log(e);
      res.json({res: e.toString()});
    }
    });

    router.post('/transferFrom', (req, res) => {
     
      try{
        if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
        let token = req.headers.authorization.split(" ")[1]
      let sender = req.body.sender;
      let recipient = req.body.recipient;
      let amount = req.body.amount;
      iyfg.transferFromToken(token ,sender,recipient, amount,(result) => {
        res.json(result);
      });
    }catch(e){
      console.log(e);
      res.json({res: e.toString()});
    }
    });

    router.post('/increaseAllowance', (req, res) => {
      
      try{
        if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
        let token = req.headers.authorization.split(" ")[1]
      let spender = req.body.spender;
      let amount = req.body.amount;
      iyfg.increaseTokenAllowance(token,spender, amount, (result) => {
        res.json(result);
      });
    }catch(e){
      console.log(e);
      res.json({res: e.toString()});
    }
    });

    router.post('/decreaseAllowance', (req, res) => {
      
      try{
        if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
        let token = req.headers.authorization.split(" ")[1]
      let spender = req.body.spender;
      let amount = req.body.amount;
      iyfg.decreaseTokenAllowance(token,spender, amount, (result) => {
        res.json(result);
      });
    }catch(e){
      console.log(e);
      res.json({res: e.toString()});
    }
    });

module.exports = router;
