/**
 * @todo use the spec post processed column instead of this.schema.whatever()
 */
class ChartsData {    
    constructor(spec, model) {
        this.spec = spec;
        this.model = model;
        this.schema = model.schema;
        this.pipeline = [];
    }        

    getData() {
        const pipeline = this.buildPipeline()        
        return this.model.aggregate(pipeline).toArray();
    }

    buildPipeline() {
        this.buildGroupBy();   
        this.buildSort();
        this.buildLimit();        
        return this.pipeline;
    }

    buildSort() {
        const { dimensions } = this.spec;
        let dateField;

        const hasDateColumn = dimensions.some(field => {            
            if (this.schema.isDatePartsColumn(field)) {
                dateField = `_id.${field}`;
                return true;
            }
            return false;
        })
        
        if (hasDateColumn) {
            this.pipeline.push({
                $sort: {[dateField]: 1}
            })
        }
    }

    buildGroupBy() {                    
        const { metrics, dimensions } = this.spec;

        let hasGroupByColumn = dimensions.length !== 0;
        let hasAggregateColumn = false;
        const $group = {
            _id: {}
        }
                
        if (hasGroupByColumn) {
            dimensions.forEach(field => {
                $group._id[field]= this.schema.getExpression(field);
            })
        } else {
            $group._id = null;
        }
        
        
        metrics.forEach(field => {
            if(this.schema.isAggregate(field)) {
                hasAggregateColumn = true;
                $group[field] = this.schema.getExpression(field);
            }
        })
        
        if (hasAggregateColumn || hasGroupByColumn) {
            this.pipeline.push({ $group })
        }        
    }
    
    buildProject() {
        const project = {};
        this.spec.select.forEach(field => {
            project[this.schema.getLabel(field)] = `$${field}`;
        });
        project._id = 0;
        this.pipeline.push({$project: project})        
    }    

    buildLimit() {
        if (this.spec.limit !== undefined) {
            this.pipeline.push({$limit: this.spec.limit})
        }
        
    }
}
module.exports = (spec, model) => new ChartsData(spec, model);