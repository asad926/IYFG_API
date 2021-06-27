const env = require('dotenv');
env.config();
const jwt = require('jsonwebtoken');
const walletDB = require('./walletDB.js')
const connect = require('../public/connection.js')
const web3 = connect.networkConnection(); 
const iyfg = require('./contract/IYFGToken.json');
var IYFG = new web3.eth.Contract(iyfg.abi, iyfg.address);
module.exports = {

    getTokenDetails: async function(token, callback) {
        try{
         let decoded = jwt.verify(token, process.env.SECRET_KEY);
         let wallet = await walletDB.checkUserWallet(decoded.uid);
         if(wallet == null) throw new Error("User did't have a wallet account created!");
         let account = wallet.account;
         let balance = await IYFG.methods.balanceOf(account).call({from: account});
         let supply = await IYFG.methods.totalSupply().call({from: account});
         let symbol = await IYFG.methods.symbol().call({from: account});
         let name = await IYFG.methods.name().call({from: account});
         let decimals = await IYFG.methods.decimals().call({from: account});
         let bal = web3.utils.fromWei(balance,"ether");
         let sup = web3.utils.fromWei(supply,"ether");

         callback({name: name, symbol: symbol, totalSupply: parseInt(sup)+" IYFG", decimals: decimals, balance: parseInt(bal)+" IYFG"})
        }catch(e){
            console.log(e)
         callback(e.toString());
        }

    },

getBalance: async function(token,address, callback) {
    try{
     let decoded = jwt.verify(token, process.env.SECRET_KEY);
     let wallet = await walletDB.checkUserWallet(decoded.uid);
     if(wallet == null) throw new Error("User did't have a wallet account created!");
     let account = wallet.account;
     IYFG.methods.balanceOf(address).call({from: account})
    .then(function(value) {
        callback(parseInt(web3.utils.fromWei(value),"ether")+" IYFG");
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
    }catch(e){
        console.log(e)
     callback(e.toString());
    }
    
    
  },


  getAllowance: async function(token ,owner,spender, callback) {
    try{
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        let wallet = await walletDB.checkUserWallet(decoded.uid);
        if(wallet == null) throw new Error("User did't have a wallet account created!");
        let account = wallet.account;
        IYFG.methods.allowance(owner,spender).call({from: account})
      .then(function(value) {
          callback(parseInt(web3.utils.fromWei(value),"ether")+" IYFG");
      }).catch(function(e) {
          console.log(e);
          callback("Error 404");
      });
       }catch(e){
           console.log(e)
        callback(e.toString());
       }
    },

    approveToken: async function(token,spender, amount, callback) {

        try{
           let amounts = web3.utils.toWei(amount,"ether");
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            let wallet = await walletDB.checkUserWallet(decoded.uid);
            if(wallet == null) throw new Error("User did't have a wallet account created!");
            let account = wallet.account;
            const rawTransaction = { 
                "from": account,  
                "to": iyfg.address,   
                "gas": 3000000,  
                "chainId": 4,
                "data": IYFG.methods.approve(spender,amounts).encodeABI()};
                let deWallet = await walletDB.decryptWallet(wallet.KeyStore,decoded.email,decoded.uid);
                const signPromise = web3.eth.accounts.signTransaction(rawTransaction, deWallet.privateKey);
                deWallet = null;
                signPromise.then((signedTx) => { 
                    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  sentTx.on("receipt", receipt => {
                      callback({transactionHash: receipt.transactionHash, from: receipt.from, gasUsed: receipt.gasUsed, status: receipt.status})
                     
                    });
                    sentTx.on("error", err => {
                      console.log(err);
                      callback(err.toString())
                    });
                  }).catch((err) => {
                    console.log(err);
                    callback(err.toString())
                  });
           }catch(e){
               console.log(e)
            callback(e.toString());
           }

    },

    transferToken: async function(token, recipient, amount ,callback) {

        try{
            let amounts = web3.utils.toWei(amount,"ether");
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            let wallet = await walletDB.checkUserWallet(decoded.uid);
            if(wallet == null) throw new Error("User did't have a wallet account created!");
            let account = wallet.account;
            const rawTransaction = { 
                "from": account,  
                "to": iyfg.address,   
                "gas": 3000000,  
                "chainId": 4,
                "data": IYFG.methods.transfer(recipient,amounts).encodeABI()};
                let deWallet = await walletDB.decryptWallet(wallet.KeyStore,decoded.email,decoded.uid);
                const signPromise = web3.eth.accounts.signTransaction(rawTransaction, deWallet.privateKey);
                deWallet = null;
                signPromise.then((signedTx) => { 
                    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  sentTx.on("receipt", receipt => {
                      callback({transactionHash: receipt.transactionHash, from: receipt.from, gasUsed: receipt.gasUsed, status: receipt.status})
      
                    });
                    sentTx.on("error", err => {
                        receipt = err.receipt;
                      console.log(err);
                      callback(err.toString())
                    });
                  }).catch((err) => {
                    console.log(err);
                    callback(err.toString())
                  });
           }catch(e){
               console.log(e)
            callback(e.toString());
           }

    },
    transferFromToken: async function(token ,sender,recipient, amount, callback) {

        try{
            let amounts = web3.utils.toWei(amount,"ether");
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            let wallet = await walletDB.checkUserWallet(decoded.uid);
            if(wallet == null) throw new Error("User did't have a wallet account created!");
            let account = wallet.account;
            const rawTransaction = { 
          "from": account,  
          "to": iyfg.address,   
          "gas": 3000000,  
          "chainId": 4,
          "data": IYFG.methods.transferFrom(sender,recipient,amounts).encodeABI()};
          let deWallet = await walletDB.decryptWallet(wallet.KeyStore,decoded.email,decoded.uid);
          const signPromise = web3.eth.accounts.signTransaction(rawTransaction, deWallet.privateKey);
          deWallet = null;
          signPromise.then((signedTx) => { 
              const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  sentTx.on("receipt", receipt => {
                callback(err.toString())

              });
              sentTx.on("error", err => {
                console.log(err);
                callback(err.toString())
              });
            }).catch((err) => {
              console.log(err);
              callback(err.toString())
            });
           }catch(e){
               console.log(e)
            callback(e.toString());
           }

      
    },

    increaseTokenAllowance: async function(token,spender, amount, callback) {

        try{
            let amounts = web3.utils.toWei(amount,"ether");
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            let wallet = await walletDB.checkUserWallet(decoded.uid);
            if(wallet == null) throw new Error("User did't have a wallet account created!");
            let account = wallet.account;
           const rawTransaction = { 
          "from": account,  
          "to": iyfg.address,   
          "gas": 3000000,  
          "chainId": 4,
          "data": IYFG.methods.increaseAllowance(spender,amounts).encodeABI()};
          let deWallet = await walletDB.decryptWallet(wallet.KeyStore,decoded.email,decoded.uid);
          const signPromise = web3.eth.accounts.signTransaction(rawTransaction, deWallet.privateKey);
          deWallet = null;
          signPromise.then((signedTx) => { 
              const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  sentTx.on("receipt", receipt => {
                callback({transactionHash: receipt.transactionHash, from: receipt.from, gasUsed: receipt.gasUsed, status: receipt.status})

              });
              sentTx.on("error", err => {
                console.log(err);
                callback(err.toString())
              });
            }).catch((err) => {
              console.log(err);
              callback(err.toString())
            });
           }catch(e){
               console.log(e)
            callback(e.toString());
           }


    },

    decreaseTokenAllowance: async function(token,spender, amount, callback) {
        try{
            let amounts = web3.utils.toWei(amount,"ether");
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            let wallet = await walletDB.checkUserWallet(decoded.uid);
            if(wallet == null) throw new Error("User did't have a wallet account created!");
            let account = wallet.account;
           const rawTransaction = { 
          "from": account,  
          "to": iyfg.address,   
          "gas": 3000000,  
          "chainId": 4,
          "data": IYFG.methods.decreaseAllowance(spender,amounts).encodeABI()};
          let deWallet = await walletDB.decryptWallet(wallet.KeyStore,decoded.email,decoded.uid);
          const signPromise = web3.eth.accounts.signTransaction(rawTransaction, deWallet.privateKey);
          deWallet = null;
          signPromise.then((signedTx) => { 
              const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  sentTx.on("receipt", receipt => {
                callback({transactionHash: receipt.transactionHash, from: receipt.from, gasUsed: receipt.gasUsed, status: receipt.status})

              });
              sentTx.on("error", err => {
                console.log(err);
                callback(err.toString())
              });
            }).catch((err) => {
              console.log(err);
              callback(err.toString())
            });
           }catch(e){
               console.log(e)
            callback(e.toString());
           }
    }
}
