var express = require('express');
var router = express.Router();
//import your custom "config" node module.
//it hold a single object that has your MySQL credentials
var bcrypt = require('bcrypt-nodejs');
var config = require('../config/config');

    //include your mysql module. we got this via npm
    var mysql = require('mysql');// a way for mysql to talk to express
    var connection = mysql.createConnection({
        host: config.host,
        user: config.userName,
        password: config.password,
        database: config.database
    });
    //we are now connected ( after this line)!
    connection.connect();// aka nodemon(run in terminal)

/* GET  HOME page. */
router.get('/index', function(req, res, next) {
    var message = req.query.msg;//can substitute msg for api key, etc
    if(message == "added"){
        message = "Your task was added!";
    }else if(message == "updated!"){
        message = "Your task was updated!"
    }else if ( message == "deleted"){
        message ="Your task was deleted!";
    }
    var selectQuery = "SELECT * FROM tasks";
    //console.log("==========About to run query=========="");
    connection.query(selectQuery,(error, results)=>{//query comes back with either error or results)
    //console.log("====")
        res.render('index',{
            message: message,
            taskArray: results// what we get back from running in mySql ( selectquery)
        });
    })
});
router.post('/index', function(req, res) {
    res.redirect('/index?login=successful')
});
//add a post route "addItem to handle the form submission"
//any form responses will be in req.body
//**********How tasks are being added to the app and database*******************
router.post('/index/addItem',(req,res)=>{
    //res.json(req.body)
    var newTask = req.body.newTask;
    var dueDate = req.body.newTaskDate;
    //we know what they submitted from the form. It comes from this route inside. req.body.NAMEOFFIELD. Now we need to insert it into MYSQL.
    var insertQuery = "INSERT INTO tasks ( taskName, taskDate) VALUES('"+newTask+"','"+dueDate+"')";//insert statement
    //res.send(insertQuery);//way to test your query
    connection.query(insertQuery,(error,results)=>{
        if(error) throw error;
        res.redirect('/index?msg=added');
    });
});
//***********How tasks are being deleted from the app and database***************

router.get('/delete/:id',(req,res)=>{
    var idToDelete=req.params.id;
    var deleteQuery ="DELETE from tasks WHERE id= " + idToDelete;
    connection.query(deleteQuery,(error,results)=>{
        res.redirect('/index?msg=deleted')

    });
    //res.send(idToDelete);
})
//make a new route to handle the edit page. It will be /edit/IDTOEDIT
router.get('/edit/:id',(req,res)=>{
    var idToEdit = req.params.id;
    var selectQuery = "SELECT * FROM tasks WHERE id = ?";
    connection.query(selectQuery,[idToEdit],(error,results)=>{
        res.render('edit',{
            task: results[0]//only one item is returned
        })
        //res.json(results);//makes it easy to see what we get back

    });
});
router.post('/editItem',(req,res)=>{
    //res.json(req.body);
    var newTask = req.body.newTask;//req.body pulled from forms
    var newTaskDate = req.body.newTaskDate;
    var idToEdit = req.query.id;//req.query- from query string.
    var updateQuery = "UPDATE tasks SET taskName = ?, taskDate = ? WHERE id =?";
    connection.query(update, [newTask, newTaskDate,idToEdit], (error,results)=>{
        res.redirect('/index?msg=updated');
    });
});


// ******************GETTING THE REGISTER PAGE**********************
router.get('/register', function(req, res) {
    res.render('register', {});
});


router.post('/register', (req,res)=>{  
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName = req.body.userName;
    var email = req.body.Email;
    var password = req.body.Password;
    var confpassword = req.body.ConfPassword;
    var hash = bcrypt.hashSync(password);
    console.log(hash);


    var insertQuery = "INSERT INTO users (firstName, lastName, userName, Email, Password) VALUES (?,?,?,?,?)";

    // res.send(insertQuery);
    connection.query(insertQuery, [firstName, lastName, userName, email, hash, confpassword],(error, results)=>{
        if(error) throw error;
        // console.log(results);
        req.body.firstName = firstName;
        req.body.lastName = lastName;
        req.body.userName = userName;
        req.body.email = email;
        req.body.confpassword = confpassword
        // req.session.loggedin = true;
        res.redirect('/index?newaccount=created');

    });


});

// ****************************************getting the  SIGN-IN page************************************

router.get('/', function(req, res) {
    res.render('sign',{ });
});


router.post('/', function(req, res) {

    var userName = req.body.userName;
    var password = req.body.Password;
    var hash= bcrypt.hashSync(password);
    var selectQuery = "SELECT * FROM users WHERE userName = ?";
    // var selectQuery = "SELECT userName, Password FROM users "
    connection.query(selectQuery, [userName],(error, results)=> {
        if (error){ throw error};
        if (results.length == 1) {
            var match = bcrypt.compareSync(password, results[0].password);

            if (match){
                req.session.loggedin = true;
                req.session.userName = results.userName;
                res.redirect('/index?login=successfull'); 
            }else {
                res.redirect('/index?login=incorrect');
            }
        }else {
            res.redirect('/');
        }
    })
})





//**************Logging Out********************
// Log out
// router.get('logout', function(req, res) {
//     req.session.user = null;
//     res.redirect('/sign');
// });


module.exports = router;
