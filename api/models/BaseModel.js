const getCollection = require("./../db/mongo").getCollection;

const aggregator = collection => ({
  aggregate(pipeline) {
    return getCollection(collection).aggregate(pipeline);
  }
});

const bulkWriter = collection => ({
  bulkWrite(documents) {
    const query = [];
    for (const document of documents) {
      query.push({ insertOne: { document } });
    }
    return query.length > 0 ? getCollection(collection).bulkWrite(query) : {};
  }
});

const deleterOne = collection => ({
  deleteOne(_id) {
    return getCollection(collection).deleteOne({ _id });
  }
});

const finder = (collection, schema) => ({
  find(query) {
    return getCollection(collection)
      .find(query)
      .toArray()
      .then(transform(schema));
  }
});

const maxFieldValueGetter = collection => ({
  async getMaxFieldValue(field, query) {
    const row = await getCollection(collection)
      .find(query)
      .project({ [field]: 1 })
      .sort({ [field]: -1 })
      .limit(1)
      .toArray();
    return row[0] ? row[0][field] : 0;
  }
});

const makeFindOne = (collection, schema) => ({
  async findOne(query) {
    const result = await finder(collection, schema).find(query);
    return result[0];
  }
});

const rawFinder = collection => ({
  findRaw(query, project) {
    return getCollection(collection)
      .find(query)
      .project(project)
      .toArray();
  }
});

const saver = collection => ({
  save(document) {
    return getCollection(collection).insertOne(document);
  }
});

const transform = schema => {
  return documents => {
    let transform;
    return documents.map(document => {
      for (var field in document) {
        if (document.hasOwnProperty(field)) {
          if ((transform = schema.getTransform(field))) {
            document[field] = transform(document[field], document);
          }
        }
      }
      return document;
    });
  };
};

const updaterOne = collection => ({
  updateOne(document) {
    return getCollection(collection).updateOne(
      { _id: document._id },
      { $set: document }
    );
  }
});

const BaseModel = (collection, schema) => {
  return Object.assign(
    {},
    aggregator(collection),
    bulkWriter(collection),
    deleterOne(collection),
    finder(collection, schema),
    makeFindOne(collection, schema),
    maxFieldValueGetter(collection),
    saver(collection),
    rawFinder(collection),
    updaterOne(collection)
  );
};

module.exports = BaseModel;
