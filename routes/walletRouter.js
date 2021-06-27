var express = require('express');
var router = express.Router();
const wallet = require('../public/wallet.js');

router.get('/', async function(req, res, next) {
  try{
    if(req.headers.authorization == null) throw new Error('Athuentication Token Not provided!');
  let token = req.headers.authorization.split(" ")[1]
    wallet.getWalletAddress(token, (result)=>{
      res.json(result);
    })
      }catch(e){
        console.log(e);
        res.json({res: e.toString()});
      }
  
});

router.post('/create', (req, res) => {
  try{
let jwt = req.headers.authorization.split(" ")[1]
  wallet.createAccount(jwt, (result) => {
    res.json(result);
  });
  }catch(e){
    console.log(e);
    res.json({err:e.toString()});
  }
  
});

router.post('/import', (req, res) => {
  try{
let jwt = req.headers.authorization.split(" ")[1];
let privateKey = req.headers.privatekey;

console.log("private: " + JSON.stringify(req.headers));
  wallet.importAccount(jwt,privateKey ,(result) => {
    res.json(result);
  });
  }catch(e){
    console.log(e);
    res.json({err:e.toString()});
  }
  
});

router.get('/export', (req, res) => {
  try{
let jwt = req.headers.authorization.split(" ")[1]
  wallet.checkUserWallet(jwt, (result) => {
    res.json(result);
  });
  }catch(e){
  console.log(e);
  res.json({err:e.toString()});
}
  
});

router.get('/balance', (req, res) => {
  try{
  let token = req.headers.authorization.split(" ")[1]
  wallet.userBalance(token, (result) => {
    res.json(result);
  });
  }catch(e){
    console.log(e);
  }
 
});
module.exports = router;
