function sandbox() {
    const pipeline = [
        {
            $group: {
                _id: {                    
                    result: "$detailedResult"   
                    
                },                             
            }
        },   
        { $sample: { size: 1 } }     
    ]
    return db.games.aggregate(pipeline);
}