const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
var dbo;
const web3 = require('./connection.js').networkConnection(); 
const {createHmac} = require('crypto');

module.exports = {

    insertWalletData: function(wallet,callback){
    MongoClient.connect(url,{useUnifiedTopology: true}, function(err, client) {
    if(err) throw err;
    dbo = client.db("WalletDB");
    dbo.collection("wallets").insertOne(wallet, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      client.close();
    });
    })
    },
    checkUserWallet:async function(id){

    let client = await MongoClient.connect(url,{useUnifiedTopology: true},{useNewUrlParser: true});
     var dbo = client.db("WalletDB");
     let collection =  dbo.collection("wallets");
     let result = await collection.findOne({userId:id});
     return result;
},
encryptWallet:async function(privateKey,email,id){
  const secret = process.env.SECRET_KEY;
  const hash = createHmac('sha256', secret)
 .update(email+id)
 .digest('hex');
  let encrypted = await web3.eth.accounts.encrypt(privateKey,hash);
   return encrypted;
},
decryptWallet:async function(privateKey,email,id){
  const secret = process.env.SECRET_KEY;
  const hash = createHmac('sha256', secret)
 .update(email+id)
 .digest('hex');
  let decrypted = await web3.eth.accounts.decrypt(privateKey,hash);
   return decrypted;
}
}