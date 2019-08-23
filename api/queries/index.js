function sandbox() {
  const pipeline = [
    {
      $match: {
        color: { $eq: "white" }
      }
    },
    {
      $group: {
        _id: {
          result: "$detailedResult",
          color: "$color"
        }
      }
    }
  ];
  return db.games.aggregate(pipeline);
}
