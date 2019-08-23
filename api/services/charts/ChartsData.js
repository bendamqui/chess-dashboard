const ModelFactory = require("./../../models/ModelFactory");
const SchemaFactory = require("./../../models/schemas/SchemaFactory");
const { functor, map } = require("./../../utils/fpUtils");
const { periods } = require("./../../types/periods");
const { periodToDateRange } = require("./../../utils/dateUtils");

const matchBuilder = ({ period, filters }, schema) => {
  return function buildMatch(pipeline) {
    const $match = {};
    if (period && period !== periods.all) {
      const { start, end } = periodToDateRange(period);
      $match.date = {
        $gte: start,
        $lt: end
      };
    }

    filters.forEach(({ field, operator, value }) => {
      $match[field] = { [operator]: value };
    });

    if (Object.keys($match).length !== 0) {
      pipeline.push({ $match });
    }
    return pipeline;
  };
};
const sortBuilder = (spec, schema) => {
  return function buildSort(pipeline) {
    const { dimensions } = spec;
    let dateField;
    const hasDateColumn = dimensions.some(({ field }) => {
      if (schema.isDatePartsColumn(field)) {
        dateField = `_id.${field}`;
        return true;
      }
      return false;
    });

    if (hasDateColumn) {
      pipeline.push({
        $sort: { [dateField]: 1 }
      });
    }
    return pipeline;
  };
};

const limitBuilder = (spec, schema) => {
  return function buildLimit(pipeline) {
    if (spec.limit !== undefined) {
      pipeline.push({ $limit: spec.limit });
    }
    return pipeline;
  };
};

const groupByBuilder = (spec, schema) => {
  return function buildGroupBy(pipeline) {
    const { metrics, dimensions } = spec;
    let hasGroupByColumn = dimensions.length !== 0;
    let hasAggregateColumn = false;
    const $group = {
      _id: {}
    };

    if (hasGroupByColumn) {
      dimensions.forEach(({ field }) => {
        $group._id[field] = schema.getExpression(field);
      });
    } else {
      $group._id = null;
    }

    metrics.forEach(({ field }) => {
      if (schema.isAggregate(field)) {
        hasAggregateColumn = true;
        $group[field] = schema.getExpression(field);
      }
    });

    if (hasAggregateColumn || hasGroupByColumn) {
      pipeline.push({ $group });
    }

    return pipeline;
  };
};

const getData = ({ spec, dataSource }) => {
  const schema = SchemaFactory(dataSource);
  const pipeline = map(
    matchBuilder(spec, schema),
    groupByBuilder(spec, schema),
    sortBuilder(spec, schema),
    limitBuilder(spec, schema)
  )(functor([]));

  return ModelFactory(dataSource)
    .aggregate(pipeline)
    .toArray();
};
module.exports = getData;
