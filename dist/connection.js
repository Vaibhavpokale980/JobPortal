let mysql=require("mysql");

let con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Vaibhav@1234",
    database:"jobportal"
});

module.exports=con;