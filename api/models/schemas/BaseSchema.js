const { DATE, DATE_PARTS } = require("./../schemas/types");

const keyExists = (hashMap, key) => {
  return hashMap[key] !== undefined;
};

const arrayToHashMap = (array, property) => {
  return array.reduce((hashMap, row) => {
    hashMap[row[property]] = row;
    return hashMap;
  }, {});
};

const labelGetter = hashMap => ({
  getLabel(key) {
    return hashMap[key].label;
  }
});

const expressionGetter = hashMap => ({
  getExpression(key) {
    return hashMap[key].expression || `$${key}`;
  }
});

const isAggregateChecker = hashMap => ({
  isAggregate(key) {
    return hashMap[key].isAggregate || false;
  }
});

const isDateColumnChecker = hashMap => ({
  isDateColumn(key) {
    return hashMap[key].type === DATE;
  }
});

const isDatePartsColumnChecker = hashMap => ({
  isDatePartsColumn(key) {
    return hashMap[key].type === DATE_PARTS;
  }
});

const columnGeter = hashMap => ({
  getColumn(key) {
    return hashMap[key];
  }
});

const columnsGeter = hashMap => ({
  getColumns() {
    return hashMap;
  }
});

const transformGetter = hashMap => ({
  getTransform(key) {
    return keyExists(hashMap, key) ? hashMap[key].transform : false;
  }
});

const chartOptionsGetter = columns => ({
  getChartOptions() {
    const metrics = [];
    const dimensions = [];
    // use reduce
    columns.forEach(column => {
      const { field: value, label } = column;
      if (column.isAggregate) {
        metrics.push({ value, label });
      } else {
        dimensions.push({ value, label });
      }
    });
    return {
      metrics,
      dimensions
    };
  }
});

const BaseSchema = columns => {
  const hashMap = arrayToHashMap(columns, "field");
  return Object.assign(
    {},
    labelGetter(hashMap),
    columnGeter(hashMap),
    transformGetter(hashMap),
    expressionGetter(hashMap),
    isAggregateChecker(hashMap),
    isDateColumnChecker(hashMap),
    isDatePartsColumnChecker(hashMap),
    chartOptionsGetter(columns),
    columnsGeter(hashMap)
  );
};

module.exports = BaseSchema;
