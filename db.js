const mongoose = require('mongoose');
require('dotenv').config();

async function getDatabase() {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || 
            'mongodb+srv://riocr922:' +
            encodeURIComponent('Parthi@123') +
            '@cluster0.i4wr4.mongodb.net/library?retryWrites=true&w=majority'
        );
        console.log('Database Connected!');
    } catch (err) {
        console.error('Database Connection Error:', err.message, err.stack);
    }
}

module.exports = {
    getDatabase
};
