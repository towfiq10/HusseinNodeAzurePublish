var express = require('express');
var path = require('path');

//leaving in the bodyParser in case we ever send up form data and need to get data out of form
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

// insert our data code here
// start by creating data so we don't have to type it in each time
let serverBookArray = [];



// define a constructor to create movie objects


const BookObject = function (pSubject, pClassfiacation, pPublisher, pAuthor, pISBN, pStockNum, pRating) {
    this.ID = pISBN.toString();
    this.Subject = pSubject;
    this.Classfication = pClassfiacation;  // action  comedy  drama  horrow scifi  musical  western
    this.Publisher = pPublisher;
    this.Author = pAuthor;
    this.ISBN = pISBN;
    this.StockNum = pStockNum;
    this.Rating = pRating;

}


// start with sampple data

serverBookArray.push(new BookObject("Build An HTML5 Game1", "Science&Math", "San Francisco : No Starch Press", "Bunyan, Karl", 9781593275754, 10, 5));
serverBookArray.push(new BookObject("The Worldly Philosophers", "History", "New York : Simon & Schuster, [1999]", "Heilbroner, Robert L.", 9780684862149, 01, 1));
serverBookArray.push(new BookObject("Philip K. Dick's Electric Dreams", "Social Science", "Boston : Houghton Mifflin Harcourt, [2017]", "Dick, Philip K.", 5261328995063, 7, 2));

// just one "site" with 2 routes

// index page , serve the HTML
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

/* GET bookList. */
app.get('/bookList', function (req, res) {
    res.json(serverBookArray);
});

/* POST to addBook */
app.post('/addBook', function (req, res) {
    console.log(req.body);
    serverBookArray.push(req.body);
    // set the res(ponse) object's status propery to a 200 code, which means success
    res.status(200).send(JSON.stringify('success'));
});



app.delete('/deleteBook/:id', (req, res) => {
    let id = req.params.id;
    console.log("app js:" + id);
    for (var i = 0; i < serverBookArray.length; i++) {
        console.log(typeof (serverBookArray[i].ID) + ":" + typeof (id))
        if (serverBookArray[i].ID === id) {
            serverBookArray.splice(i, 1);  // remove 1 element at loc i
            res.send('success');
        }
    }
    res.status(404);  // if not found
});


// error page 
app.get('/error', function (req, res) {
    // should get real data from some real operation, but instead ...
    let message = "some text from someplace";
    let errorObject = {
        status: "this is real bad",
        stack: "somebody called #$% somebody who called somebody <awful>"
    };
    res.render('pages/error', {  // pass the data to the page renderer
        message: message,
        error: errorObject
    });
});


app.listen(process.env.PORT || 80); // not setting port number in www.bin, simple to do here
//app.listen(3000);  // setting port number 
console.log('3000 is the magic port');
//console.log('Azure requires port 80');

module.exports = app;



