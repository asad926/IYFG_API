const walletDB = require('./walletDB.js')
const connect = require('./connection.js')
const web3 = connect.networkConnection(); 
const jwt = require('jsonwebtoken');

module.exports = {

    getWalletAddress: async function(token, callback) {
        try {
            let decoded = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['RS256']});
            let wallet = await walletDB.checkUserWallet(decoded.uid)

       if(wallet == null){
        callback({message:"Wallet account not found!"})
      }else{
       callback({ address: wallet.account });
      }
        }catch(e){
            console.log(e);
            callback(e.toString());
        }
        
    },

    createAccount: async function(token, callback) {
      try{
       let decoded = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['RS256']});
       let wallet = await walletDB.checkUserWallet(decoded.uid)
       if(wallet != null) {
           callback({"msg": "User Already Have Wallet Created!!"})
       }else{
       let account = web3.eth.accounts.create(web3.utils.randomHex(32))
       let encKeyStore = await walletDB.encryptWallet(account.privateKey,decoded.email,decoded.uid);
       let walletObj = {userId: decoded.uid,email: decoded.email,account: account.address, KeyStore: encKeyStore}
       walletDB.insertWalletData(walletObj)
        callback({"address":account.address});
       }
      }catch(e){
          console.log(e);
          callback(e.toString())
      } 
      },

      importAccount: async function(token,privateKey, callback) {
        try{
         let decoded = jwt.verify(token, process.env.SECRET_KEY);
         let wallet = await walletDB.checkUserWallet(decoded.uid)
         if(wallet != null) {
             callback({"msg": "User Already Have Wallet Created!!"})
         }else{
         let account = web3.eth.accounts.privateKeyToAccount(privateKey);
         let encKeyStore = await walletDB.encryptWallet(account.privateKey,decoded.email,decoded.uid);
         let walletObj = {userId: decoded.uid,email: decoded.email,account: account.address, KeyStore: encKeyStore}
         walletDB.insertWalletData(walletObj)
          callback({"address":account.address});
         }
        }catch(e){
            console.log(e);
            callback(e.toString())
        } 
        },

      checkUserWallet: async function(token, callback) {
        try{
        //     jwttoken = jwt.sign({
        //         uid: 1,
        //         username: "Asad",
        //         email: "asad926@gmail.com"
        //       }, process.env.SECRET_KEY, {algorithm: 'HS256' ,expiresIn: '24h' });
        // console.log("jwttoken: " + jwttoken)
         let decoded = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['RS256'] });
         let wallet = await walletDB.checkUserWallet(decoded.uid);
        if(wallet == null) {
          callback({"msg": "Wallet account not found!"})
      }else{
          callback(await walletDB.decryptWallet(wallet.KeyStore, decoded.email, decoded.uid));
      }
        }catch(e){
            console.log(e);
            callback(e.toString())
        } 
        },

        userBalance: async function(token,callback) {
            try{
                let decoded = jwt.verify(token, process.env.SECRET_KEY,{ algorithms: ['RS256']});
                let wallet = await walletDB.checkUserWallet(decoded.uid)
                let bal = await web3.eth.getBalance(wallet.account)
                let ethBal = web3.utils.fromWei(bal, 'ether');
              callback({balance:""+ethBal+" ETH" });
            }catch(e){
                console.log(e);
                callback(e.toString())
            } 
            }
}