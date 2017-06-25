var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'x',
    password: 'x',
    database: 'To-Do-App'
});

connection.connect();

//******************GETTING THE REGISTER PAGE**********************
router.get('/register', function(req, res) {
    res.render('register', {});
});


router.post('/register', (req,res)=>{

    console.log(req.body.firstName);
    
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName = req.body.userName;
    var email = req.body.Email;
    var password = req.body.Password;
    var confPassword = req.body.ConfPassword;
    // var hash = bcrypt.hashSync(password);


    var insertQuery = "INSERT INTO Users (firstName, lastName, userName, Email, Password, ConfPassword ) VALUES (?,?,?,?,?,?)";

    // res.send(insertQuery);
    connection.query(insertQuery, [firstName, lastName, userName, email, password, confPassword],(error, results)=>{
        if(error) throw error;
        console.log(results);
        res.redirect('http://localhost:3000/?newaccount=created');

    });


});

//****************************************getting the  SIGN-IN page************************************

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
    var selectQuery = "SELECT userName, Password FROM Users WHERE userName=? Password = ?)";
    connection.query(selectQuery, [userName,Password],(error, results)=> {
        if (results.length == 1) {
            // var match = bcrypt.compareSync(password, results[0].password);
            if (match == true) {
                res.render('/localhost:3000');
            }else {
                res.redirect('/sign?msg=loginattempt=successful');
            }
        }else {
            res.redirect('/sign?msg=badlogin');
        }
    })
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// router.post('/', (req,res)=>{
   
//     var Monday = req.body.Monday;
//     var Tuesday = req.body.Tuesday;
//     var Wednesday = req.body.Wednesday;
//     var Thursday = req.body.Thursday;
//     var Friday = req.body.Friday;
//     var AppointmentDetails = req.body.AppointmentDetails;
//     var AppointmentTime = req.body.AppointmentTime;
//     var Calls = req.body.Calls;
//     var Emails = req.body.Wednesday;
//     var CompleteList = req.body.CompleteList;
//     var GetitDone = req.body.GetitDone;
//     var Notes = req.body.Notes;
//     // var hash = bcrypt.hashSync(password);


//     var insertQuery = "INSERT INTO Tasks (Monday, Tuesday, Wednesday, Thursday, Friday , AppointmentDetails, AppointmentTime , Calls , Emails , CompleteList , GetitDone , Notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

//     // res.send(insertQuery);
//     connection.query(insertQuery, [Monday, Tuesday, Wednesday, Thursday, Friday , AppointmentDetails, AppointmentTime , Calls , Emails , CompleteList , GetitDone , Notes],(error, results)=>{
//         if(error) throw error;
//         console.log(results);
//         res.redirect('http://localhost:3000/?toDoData=added');

//     });


// });


//**************Logging Out********************
// Log out
// router.get('logout', function(req, res) {
//     req.session.user = null;
//     res.redirect('/sign');
// });


module.exports = router;
