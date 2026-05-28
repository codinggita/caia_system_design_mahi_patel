
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const dumpData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collection = mongoose.connection.db.collection('designs');
        const doc = await collection.findOne();
        console.log(JSON.stringify(doc, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

dumpData();
