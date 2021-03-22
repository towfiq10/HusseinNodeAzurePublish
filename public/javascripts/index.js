// start by creating data so we don't have to type it in each time
let bookArray = [];
let savedList = [];

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




document.addEventListener("DOMContentLoaded", function () {
    createList();


    document.getElementById("searchBtn").addEventListener("click", function (event) {

        let category = document.getElementById("select-category");
        let text = document.getElementById("searchTxt");

        if (text.value !== "") {
            let searchList = makeListBySearch(category.value, text.value)
            text.value = "";
            if (searchList.length > 0) {
                createList(searchList);
            } else {
                let divBookList = document.getElementById("divBookList");
                while (divBookList.firstChild) {    // remove any old data so don't get duplicates
                    divBookList.removeChild(divBookList.firstChild);
                };

                divBookList.innerHTML = " <i class='fas fa-quote-right' style='font-size: 80px;'><br/><p  style='font-size: 15px;'> No Result !</p></i>"

            }

        } else {
            createList();
        }



    });


    document.getElementById("deleteBook").addEventListener("click", function (event) {
        if (isManager()) {

            let id = document.getElementById("IDparmHere").innerHTML;

            let i = GetArrayPointer(id);

            deleteBook(bookArray[i].ID);

            createList();  // recreate li list after removing one
            document.location.href = "index.html#ListAll";  // go back to movie list 



        } else {
            alert("Sorry,Employee can only delete the book.");


        }
    });


    //add button events *****
    document.getElementById("buttonAdd").addEventListener("click", function (event) {



        //also add the url value
        if (checkInput()) {
            if (isManager()) {

                let newBook = new BookObject(document.getElementById("Subject").value,
                    document.getElementById("select-genre").value,
                    document.getElementById("Publisher").value,
                    document.getElementById("Author").value,
                    parseInt(document.getElementById("ISBN").value),
                    parseInt(document.getElementById("StockNum").value),
                    parseInt(document.getElementById("Rating").value)

                );
                addNewBook(newBook);

                clearInput();
                document.location.href = "index.html#ListAll";
            } else {
                alert("Only manager can add the new book.");
                clearInput();
                document.location.href = "index.html#ListAll";
            }

        }

    });


    document.getElementById("buttonClear").addEventListener("click", function () {
        clearInput();

    });



    //2 sort button event methods


    document.getElementById("saveOrRemoveBtn").addEventListener("click", function (event) {

        let status = document.getElementById("saveOrRemoveBtn").value
        let pointer = GetArrayPointer(document.getElementById("IDparmHere").innerHTML)

        if (status === "saved") {


            let result = savedList.findIndex(item => item.ID === document.getElementById("IDparmHere").innerHTML)

            savedList.splice(result, 1);
            document.getElementById("saveOrRemoveBtn").value = "notSaved"
            document.getElementById("saveOrRemoveBtn").innerHTML = "save<br/><i class='fas fa-heart' id='saveIcon' ></i>"
            document.getElementById("saveIcon").style.color = "red";
        } else {

            savedList.push(bookArray[pointer]);
            document.getElementById("saveOrRemoveBtn").value = "saved"
            document.getElementById("saveOrRemoveBtn").innerHTML = "remove<br/><i class='far fa-heart'></i>"
            document.getElementById("saveIcon").style.color = "grey";
        }


    });




    // page before show code *************************************************************************
    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 

        FillArrayFromServer();
    });


    $(document).on("pagebeforeshow", "#MyList", function (event) {   // have to use jQuery 
        if (savedList.length > 0) {
            createMyList();
        } else {

            var divBookList = document.getElementById("divMyBookList");
            divBookList.innerHTML = "<i class='fas fa-quote-right' style='font-size: 80px;'></i>";
        }

    });




    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#details", function (event) {   // have to use jQuery 
        showDetail();

    });

    // end of page before show code *************************************************************************

});
// end of wait until document has loaded event  *************************************************************************

function createList(arr) {
    //call the node server and it will return an array of movies
    // clear prior data
    let divBookList = document.getElementById("divBookList");
    while (divBookList.firstChild) {    // remove any old data so don't get duplicates
        divBookList.removeChild(divBookList.firstChild);
    };
    let showArray = [];
    let ul = document.createElement('ul');

    if (arr === undefined || arr === null) {

        showArray = bookArray;
    } else {
        showArray = arr;
    }
    showArray.forEach(function (element,) {   // use handy array forEach method
        let li = document.createElement('li');
        // adding a class name to each one as a way of creating a collection
        li.classList.add('oneBook');
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        li.setAttribute("data-parm", element.ID);

        li.innerHTML = element.Subject + "<p style='font-size:12px'> ISBN#:" + element.ISBN + "<hr>";
        ul.appendChild(li);
    });
    divBookList.appendChild(ul)
    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneBook");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {

            var parm = this.getAttribute("data-parm");
            document.getElementById("IDparmHere").innerHTML = parm;

            document.location.href = "index.html#details";
        });
    });

};
function createMyList() {
    //call the node server and it will return an array of movies
    // clear prior data
    var divBookList = document.getElementById("divMyBookList");
    while (divBookList.firstChild) {    // remove any old data so don't get duplicates
        divBookList.removeChild(divBookList.firstChild);
    };

    var ul = document.createElement('ul');


    savedList.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        // adding a class name to each one as a way of creating a collection
        li.classList.add('oneBook');
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        li.setAttribute("data-parm", element.ID);


        li.innerHTML = element.Subject + "<p style='font-size:12px'> ISBN#:" + element.ISBN + "<hr>";
        ul.appendChild(li);

    });
    divBookList.appendChild(ul)

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneBook");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
            // get that data-parm we added for THIS particular li as we loop thru them
            var parm = this.getAttribute("data-parm");  // passing in the record.Id
            // get our hidden <p> and write THIS ID value there
            document.getElementById("IDparmHere").innerHTML = parm;
            // now jump to our page that will use that one item
            document.location.href = "index.html#details";
        });
    });

};


function showDetail() {





    if (document.getElementById("IDparmHere").innerHTML == "change1") {
        alert('sorry, temporary error, please try again');
        document.location.href = "index.html#ListAll";
    }
    // normal path
    else {
        let localID = document.getElementById("IDparmHere").innerHTML;
        let pointer = GetArrayPointer(localID)

        if (isSaved(localID)) {

            document.getElementById("saveOrRemoveBtn").value = "saved"
            document.getElementById("saveOrRemoveBtn").innerHTML = "remove<br/><i class='far fa-heart' id='saveIcon' ></i>"
            document.getElementById("saveIcon").style.color = "grey";
        } else {

            document.getElementById("saveOrRemoveBtn").value = "notSaved"
            document.getElementById("saveOrRemoveBtn").innerHTML = "save<br/><i class='fas fa-heart'  id='saveIcon' ></i>"
            document.getElementById("saveIcon").style.color = "red";
        }


        document.getElementById("oneTitle").innerHTML = "The title is: " + bookArray[pointer].Subject;
        document.getElementById("onePublisher").innerHTML = "Publisher: " + bookArray[pointer].Publisher;
        document.getElementById("oneClassify").innerHTML = "Classification:" + bookArray[pointer].Classfication
        document.getElementById("oneAuthor").innerHTML = "Author : " + bookArray[pointer].Author;
        if (bookArray[pointer].StockNum > 0) {
            document.getElementById("oneInstock").innerHTML = "Instock: yes";
        } else {
            document.getElementById("oneInstock").innerHTML = "Instock: no ";
        }

        document.getElementById("oneISBN").innerHTML = "ISBN#: " + bookArray[pointer].ISBN;
        document.getElementById("oneRating").innerHTML = "Rating#: " + bookArray[pointer].Rating;
    }
}


// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
    for (let i = 0; i < bookArray.length; i++) {

        if (localID === bookArray[i].ID) {
            return i;
        }
    }
}
function isSaved(localID) {
    for (let i = 0; i < savedList.length; i++) {
        if (localID === savedList[i].ID) {
            return true;
        }
    }
    return false;
}


function isManager() {
    let id = prompt("id:");
    let pw = prompt("pw: ")
    if (id === "admin" && pw === "admin") {
        return true;

    } else {
        return false;
    }
}

//Hussein added 3/10/21
/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/
function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}

function makeListBySearch(which, text) {
    let filteredArr = []



    switch (which) {
        case "Subject":

            for (let i = 0; i < bookArray.length; i++) {

                if (bookArray[i].Subject.replace(" ", "").toUpperCase().includes(text.toUpperCase().replace(" ", ""))) {

                    filteredArr.push(bookArray[i]);
                }
            }

            break;
        case "Rating":
            for (let i = 0; i < bookArray.length; i++) {

                if (bookArray[i].Rating == parseInt(text)) {

                    filteredArr.push(bookArray[i]);
                }
            }

            break;

        case "Classification":

            for (let i = 0; i < bookArray.length; i++) {

                if (bookArray[i].Classfication.toUpperCase().includes(text.replace(" ", "").toUpperCase())) {

                    filteredArr.push(bookArray[i]);
                }
            }

            break;

        case "Author":

            for (let i = 0; i < bookArray.length; i++) {

                if (bookArray[i].Author.replace(" ", "").toUpperCase().includes(text.replace(" ", "").toUpperCase())) {

                    filteredArr.push(bookArray[i]);
                }
            }

            break;
        default:
            filteredArr = bookArray;
            break;


    }
    return filteredArr;
}


function clearInput() {
    document.getElementById("Subject").value = "";
    document.getElementById("Publisher").value = "";
    document.getElementById("Author").value = "";
    document.getElementById("Rating").value = "";
    document.getElementById("ISBN").value = "";
    document.getElementById("StockNum").value = "";
    document.getElementById("select-genre").value = "";
}

function checkInput() {
    let subject = document.getElementById("Subject")
    let Publisher = document.getElementById("Publisher")
    let Author = document.getElementById("Author")
    let Rating = document.getElementById("Rating")
    let ISBN = document.getElementById("ISBN")
    let StockNum = document.getElementById("StockNum")
    let genre = document.getElementById("select-genre")


    if (subject.value === undefined || subject.value === "") {
        alert("Please enter the subject! ")
        subject.focus();
        subject.value = "";
        return false;
    }
    if (Publisher.value === undefined || Publisher.value === "") {
        alert("Please enter the publisher ! ")
        Publisher.value = ""
        Publisher.focus();
        return false;
    }
    if (Author.value === undefined || Author.value === "") {
        alert("Please enter the Author! ")
        Author.focus();
        Author.value = "";
        return false;
    }



    if (Rating.value === undefined || Rating.value === "") {
        alert("Please enter the rating(1~5)! ")
        Rating.focus();
        Rating.value = "";
        return false;
    } else {
        if (Rating.value < 0 || Rating.value > 5) {
            alert("Please enter the rating(0~5)! ")
            Rating.value = "";
            Rating.focus();
            return false;
        }
    }


    if (ISBN.value === undefined || ISBN.value === "" || ISBN.value.length < 8 || ISBN.value.length > 13) {
        alert("Please enter the 8~13 digit ISBN#")
        ISBN.focus();
        ISBN.value = ""
        return false;
    }



    if (StockNum.value === undefined || StockNum.value === "") {
        alert("Please, enter the instock number!  ")
        StockNum.focus();
        StockNum.value = ""
        return false;
    }


    return true;

}



//get info from sever
function FillArrayFromServer() {
    // using fetch call to communicate with node server to get all data
    fetch('/bookList')
        .then(function (theResonsePromise) {  // wait for reply.  Note this one uses a normal function, not an => function

            return theResonsePromise.json();
        })
        .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client

            bookArray.length = 0;  // clear array
            bookArray = serverData;   // use our server json data which matches our objects in the array perfectly
            createList();  // placing this here will make it wait for data from server to be complete before re-doing the list
        })
        .catch(function (err) {
            console.log(err);
        });
};



// using fetch to push an object up to server
function addNewBook(newBook) {
    // the required post body data is our movie object passed into this function

    // create request object
    const request = new Request('/addBook', {
        method: 'POST',
        body: JSON.stringify(newBook),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });

    // use that request object we just created for our fetch() call
    fetch(request)
        .then(function (theResonsePromise) {    // the .json sets up 2nd promise
            return theResonsePromise.json()
        })
        // now wait for the 2nd promise, which is when data has finished being returned to client
        .then(function (theResonsePromiseJson) {
            console.log(theResonsePromiseJson.toString())

        })
        // the client console log will write out the message I added to the Repsonse on the server
        .catch(function (err) {
            console.log(err);
        });
}; // end of addNewMovie




function deleteBook(which) {

    fetch('/deleteBook/' + which, {
        method: 'DELETE'
    })
        .then(function (theResonsePromise) {
            alert("Movie successfully deleted in cloud")
        })
        .catch(function (err) {
            alert("Movie NOT deleted in cloud " + err);
        });
};


function filterKey(filter) {
    if (filter) {
        var sKey = String.fromCharCode(event.keyCode);
        var re = new RegExp(filter);
        if (!re.test(sKey)) event.returnValue = false;
    }
}

