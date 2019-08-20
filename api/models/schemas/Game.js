const { STRING, NUMBER, DATE_PARTS } = require("./types");
const BaseSchema = require("./BaseSchema");

const columns = [
  /**
   * Metrics
   */
  {
    type: NUMBER,
    label: "#Games",
    field: "gameCount",
    expression: { $sum: 1 },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Rating( Max) ",
    field: "ratingMax",
    expression: { $max: "$user.rating" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Opponent Rating( Max) ",
    field: "opponentRatingMax",
    expression: { $max: "$opponent.rating" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Win (Checkmate)",
    field: "checkmateWinSum",
    expression: { $sum: "$metrics.win.checkmated" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Win (Timeout)",
    field: "timeoutWinSum",
    expression: { $sum: "$metrics.win.timeout" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Win (Abandoned)",
    field: "abandonedWinSum",
    expression: { $sum: "$metrics.win.abandoned" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Win (Resignation)",
    field: "resignedWinSum",
    expression: { $sum: "$metrics.win.resigned" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Lost (Checkmate)",
    field: "checkmateLostSum",
    expression: { $sum: "$metrics.lost.checkmated" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Lost (Timeout)",
    field: "timeoutLostSum",
    expression: { $sum: "$metrics.lost.timeout" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Lost (Abandoned)",
    field: "abandonedLostSum",
    expression: { $sum: "$metrics.lost.abandoned" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Lost (Resignation)",
    field: "resignedLostSum",
    expression: { $sum: "$metrics.lost.resigned" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Draw (agreed)",
    field: "agreedDrawSum",
    expression: { $sum: "$metrics.draw.agreed" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Draw (Insufficient Material)",
    field: "insufficientDrawSum",
    expression: { $sum: "$metrics.draw.insufficient" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Draw (Repetition)",
    field: "repetitionDrawSum",
    expression: { $sum: "$metrics.draw.repetition" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Draw (50 Moves)",
    field: "50moveDrawSum",
    expression: { $sum: "$metrics.draw.50move" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Draw (Stalemate)",
    field: "stalemateDrawSum",
    expression: { $sum: "$metrics.draw.stalemate" },
    isAggregate: true
  },
  {
    type: NUMBER,
    label: "Draw (Time vs Insufficient Material)",
    field: "timevsinsufficientDrawSum",
    expression: { $sum: "$metrics.draw.timevsinsufficient" },
    isAggregate: true
  },

  /**
   * Dimensions
   */
  { type: STRING, label: "Game Url", field: "url" },
  { type: STRING, label: "Detailed Result", field: "detailedResult" },
  { type: STRING, label: "Result", field: "result" },
  { type: STRING, label: "Time Control", field: "time_control" },
  { type: NUMBER, label: "End Time", field: "end_time" },
  {
    type: DATE_PARTS,
    label: "Year",
    field: "year",
    expression: {
      year: { $year: "$date" }
    }
  },
  {
    type: DATE_PARTS,
    label: "Month",
    field: "month",
    expression: {
      year: { $year: "$date" },
      month: { $month: "$date" }
    }
  },
  {
    type: DATE_PARTS,
    label: "Day",
    field: "day",
    expression: {
      year: { $year: "$date" },
      month: { $month: "$date" },
      day: { $dayOfMonth: "$date" }
    }
  }
];

module.exports = BaseSchema(columns);
