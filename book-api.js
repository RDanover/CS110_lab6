const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post ('/book', (req, res) => {
    const book = req.body; 

    console.log(book);
    books.push(book) ;
    res.send('Book is added to the database');
});

//colon is the parameter 
app.post ('/book/:isbn', (req, res) => {
    const isbn = req.params.isbn; 
    const newBook = req.body;

    //replace item in the books array

    for(let i =0; i<books.length;i++){
        let book = books[i];

        if(book.isbn === isbn){
            books[i] = newBook;
        }
    }

    res.send('Book is edited');
});

app.get('/books', (req,res) =>{
    res.json(books);
});

app.get('/book/:isbn', (req, res) => {//get book by isbn used for edit form
    const isbn = req.params.isbn;
    for(let i = 0; i<books.length;i++){
        let book = books[i];
        if(book.isbn === isbn){
            var book_to_send = books[i];
        }
    }
    res.json(book_to_send);
});

app.delete ('/book/:isbn', (req, res) => {
    const isbn = req.params.isbn; 
    const newBook = req.body;

    //remove item from the books array

    for(let i =0; i<books.length;i++){
        let book = books[i];

        if(book.isbn === isbn){
            books.splice(i,1);//removes book at index i 
        }
    }

    res.send('Book is removed');
});

app.listen(port, () => console.log(`Hello World app listening on port ${port}!`))