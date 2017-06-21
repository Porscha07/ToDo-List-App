var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var ejs = require('ejs');


// $(document).ready(function() {
//     $("button").click(function(){
//         res.render('index');
//     });
// });









/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

//getting the Home page-sign-in page
router.get('/sign', function(req, res) {
     var message = req.query.msg;
         if(message == "badlogin"){
            message="Incorrect Login"    
        }else if (message == null){
            message = " "
        }
    res.render('sign', {
        message:message
    });
});


router.post('/sign', function(req, res) {
    var user = req.body.user;
    var password = req.body.password;
    var selectQuery = "SELECT * FROM Register WHERE user = ?";
    connection.query(selectQuery, [user], function(error, results) {
        if (results.length == 1) {
            var match = bcrypt.compareSync(password, results[0].password);
            if (match == true) {
                res.render('/localhost:3000');
            }else {
                res.redirect('/sign?msg=badlogin');
            }
        }else {
            res.redirect('/sign?msg=badlogin');
        }
    })
})

//getting the register page
router.get('/register', function(req, res) {
    res.render('register', {});
});


router.post('/register', (req,res)=>{
    
    var firstname = req.body.firstname;
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    var lastname = req.body.lastname;
    var hash = bcrypt.hashSync(password);


    var insertQuery = "INSERT INTO Register (firstname, email, password, username, lastname) VALUES (?,?,?,?,?)";

    // res.send(insertQuery);
    connection.query(insertQuery, [firstname, email, hash, username, lastname ], (error, results)=>{
        if(error) throw error;
        res.redirect('http://localhost:3000/?item=added');
    });

});