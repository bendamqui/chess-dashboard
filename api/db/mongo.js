const MongoClient = require("mongodb").MongoClient;
const { DATABASE_URL } = process.env;

let db;
let mongoClient;

/**
 * Connect to mongodb and make the client accessible through exports.mongo
 *
 * @returns {Promise}
 */
const init = async () => {  
  mongoClient = new MongoClient(DATABASE_URL, { useNewUrlParser: true });
  await mongoClient.connect();
  db = mongoClient.db();
};

/**
 * @returns {Db}
 */
const getDb = () => {
  return db;
};

const getCollection = (collection) => {
  return getDb().collection(collection);
}

const closeConnection = () => {
  return mongoClient.close();
}

module.exports = {
  init,
  getDb,
  getCollection,
  closeConnection
};
