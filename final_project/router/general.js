const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists." });
  }
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {

  res.json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const result = Object.values(books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  res.json({ bookbyauthor: result });
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const result = Object.values(books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  );
  res.json({bookbytitle : result});
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});


// Task 10: Get the list of books using Promise callbacks
public_users.get("/books-promise", (req, res) => {
    new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No books available.");
      }
    })
      .then((bookList) => res.json(bookList))
      .catch((err) => res.status(500).json({ message: err }));
  });
  
  // Task 11: Get book details by ISBN using Async/Await
  public_users.get("/isbn-async/:isbn", async (req, res) => {
    try {
      const isbn = req.params.isbn;
      if (books[isbn]) {
        res.json(books[isbn]);
      } else {
        res.status(404).json({ message: "Book not found." });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching the book." });
    }
  });
  
  // Task 12: Get book details by Author using Promise callbacks
public_users.get("/author-promise/:author", (req, res) => {
    const author = req.params.author.toLowerCase();
  
    new Promise((resolve, reject) => {
      const result = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author
      );
      if (result.length > 0) {
        resolve(result);
      } else {
        reject("No books found for this author.");
      }
    })
      .then((result) => res.json(result))
      .catch((err) => res.status(404).json({ message: err }));
  });
  
  // Task 13: Get book details by Title using Promise callbacks
  public_users.get("/title-promise/:title", (req, res) => {
    const title = req.params.title.toLowerCase();
  
    new Promise((resolve, reject) => {
      const result = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title
      );
      if (result.length > 0) {
        resolve(result);
      } else {
        reject("No books found for this title.");
      }
    })
      .then((result) => res.json(result))
      .catch((err) => res.status(404).json({ message: err }));
  });

module.exports.general = public_users;