const mongoose = require("mongoose");

// use process.env variables
const host = process.env.DB_HOSTNAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const clusterName = process.env.CLUSTER_NAME;
const dbName = process.env.DB_NAME;


const connectionUri = `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority&appName=${clusterName}`;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function startConnection() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(connectionUri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  } 
}

module.exports = startConnection;
