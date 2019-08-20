const { OBJECT } = require("./types");
const BaseSchema = require("./BaseSchema");
const SchemaFactory = require("./SchemaFactory");

// @todo create two pseudo columns instead
const augmentSpec = (value, row) => {
  const DataSourceSchema = SchemaFactory(row.dataSource);
  // @todo reduce | spec as functor/monad identity map function
  ["metrics", "dimensions"].map(prop => {
    value[prop] = value[prop].map(field => {
      return DataSourceSchema.getColumn(field);
    });
  });
  return value;
};

const columns = [
  {
    type: OBJECT,
    label: "spec",
    field: "spec",
    transform: augmentSpec
  }
];

module.exports = BaseSchema(columns);
