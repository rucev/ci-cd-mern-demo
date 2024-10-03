const mongoose = require('mongoose');

const dropDB = async () => {
    await mongoose.connection.db.dropDatabase();
}

dropDB();