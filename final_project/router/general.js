
const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const API_URL = "http://localhost:5000";

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    const booksByAuthor = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(author)
    );

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    }

    return res.status(404).json({
        message: "Author not found"
    });
});

// Get books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    const booksByTitle = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(title)
    );

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

// ==========================================
// ASYNCHRONOUS ROUTES USING AXIOS
// ==========================================

// Get all books using async/await and Axios
public_users.get('/asyncbooks', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/`);

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get book by ISBN using async/await and Axios
public_users.get('/asyncisbn/:isbn', async (req, res) => {
    try {
        const isbn = encodeURIComponent(req.params.isbn);

        const response = await axios.get(
            `${API_URL}/isbn/${isbn}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;

        return res.status(status).json({
            message: "Error retrieving book by ISBN"
        });
    }
});

// Get books by author using async/await and Axios
public_users.get('/asyncauthor/:author', async (req, res) => {
    try {
        const author = encodeURIComponent(req.params.author);

        const response = await axios.get(
            `${API_URL}/author/${author}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;

        return res.status(status).json({
            message: "Error retrieving books by author"
        });
    }
});

// Get books by title using async/await and Axios
public_users.get('/asynctitle/:title', async (req, res) => {
    try {
        const title = encodeURIComponent(req.params.title);

        const response = await axios.get(
            `${API_URL}/title/${title}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        const status = error.response?.status || 500;

        return res.status(status).json({
            message: "Error retrieving books by title"
        });
    }
});

module.exports.general = public_users;
