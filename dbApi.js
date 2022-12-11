const  fs = require("fs");
const USER_HOME = process.env.HOME || process.env.USERPROFILE
const path = require('path');
const dbPath = path.join(USER_HOME,'.node_todo','db.json')

fs.mkdir(path.join(USER_HOME,'.node_todo'), { recursive: true }, (err) => {
    if (err) throw err;
});

module.exports.get = function(){
    return new Promise((resolve, reject) =>{
        fs.readFile(dbPath,{flag:'r'},(err,data) =>{
            if(err)return reject(err)
            return resolve(JSON.parse(data.toString()))
        });
    })
}
module.exports.write = function(data){
    return new Promise((resolve, reject) =>{
        fs.writeFile(dbPath,data+'\n',{flag:'w'}, (err) => {
            if(err)return reject(err)
            return resolve(1)
        });
    })
}

module.exports.clear = function(){
    return new Promise((resolve, reject) =>{
        fs.writeFile(dbPath,'[]',{flag:'w'},(err)=>{
            if(err)return reject(err)
        })
    })
}