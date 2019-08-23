const { periods } = require("./../types/periods");
const moment = require("moment");

const periodToDateRange = period => {
  switch (period) {
    case periods.today:
      return momentStartOfAndEndOf("day");
    case periods.currentWeek:
      return momentStartOfAndEndOf("week");
    case periods.currentMonth:
      return momentStartOfAndEndOf("month");
    case periods.currentYear:
      return momentStartOfAndEndOf("year");
    default:
      throw Error("Invalid Period");
  }
};

const momentStartOfAndEndOf = period => {
  return {
    start: moment()
      .startOf(period)
      .toDate(),
    end: moment()
      .endOf(period)
      .toDate()
  };
};

module.exports.periodToDateRange = periodToDateRange;
