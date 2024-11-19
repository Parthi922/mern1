const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB (Make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/library');

// Define the Book model schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
});

const BookModel = mongoose.model('Book', bookSchema);

// Set view engine to Handlebars
app.set('views', 'views');
app.set('view engine', 'hbs');

// Middleware
app.use(bodyparser.urlencoded({ extended: true }));

// Routes

// Route to get all books and render the main page
app.get("/", async (req, res) => {
  try {
    let books = await BookModel.find({});
    let message = '';
    let edit_id, edit_book;

    // Handle edit and delete operations
    if (req.query.edit_id) {
      edit_id = req.query.edit_id;
      edit_book = await BookModel.findById(edit_id);
    }

    if (req.query.delete_id) {
      await BookModel.deleteOne({ _id: new ObjectId(req.query.delete_id) });
      return res.redirect('/?status=3');
    }

    switch (req.query.status) {
      case '1':
        message = 'Inserted Successfully';
        break;
      case '2':
        message = 'Updated Successfully';
        break;
      case '3':
        message = 'Deleted Successfully';
        break;
      default:
        break;
    }

    res.render('main', { message, books, edit_id, edit_book });
  } catch (error) {
    console.error("Error retrieving books:", error);
    res.status(500).send("Error retrieving books");
  }
});

// Route to store a new book in the database
app.post("/store_books", async (req, res) => {
  try {
    console.log(req.body); // Log the request body to check if authors are coming through
    const { title, authors } = req.body; // Destructure title and authors
    const book = new BookModel({ title, authors });
    await book.save();
    return res.redirect('/?status=1');
  } catch (error) {
    console.error("Error saving book:", error);
    res.status(500).send("Error saving book");
  }
});

// Route to update an existing book
app.post("/update_books/:edit_id", async (req, res) => {
  try {
    let edit_id = req.params.edit_id;
    console.log(req.body); // Log the request body to check if authors are coming through
    await BookModel.findOneAndUpdate(
      { _id: new ObjectId(edit_id) },
      { title: req.body.title, authors: req.body.authors }
    );
    return res.redirect('/?status=2');
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).send("Error updating book");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
