// auth_users.js
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "1h",
    });
    req.session.token = token;
    res.json({ message: "Customer Login successful."});
  } else {
    res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { username } = req.user; // Extract username from the authenticated session
    const { review } = req.query; // Extract the review from the query parameters
    const isbn = req.params.isbn; // Extract the ISBN from the request parameters
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review query parameter is required." });
    }
  
    // Add or update the review for the current user
    books[isbn].reviews[username] = review;
  
    res.json({
      message: "Review added or updated successfully.",
      reviews: books[isbn].reviews,
    });
  });
  

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.user;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user." });
  }

  delete books[isbn].reviews[username];
  res.json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
