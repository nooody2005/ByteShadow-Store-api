class APIFeatures {
    constructor(query,queryOBJ){
        this.query = query;
        this.queryOBJ = queryOBJ;
    }

    filter(){
        //1A)FILTERING
        const queryObj = {...this.queryOBJ};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //1B)ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g ,match => `$${match}`);

        this.query =  this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort(){
        if (this.queryOBJ.sort){
            const sortBy = this.queryOBJ.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query =  this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields(){
        if (this.queryOBJ.fields){
            const fields = this.queryOBJ.fields.split(',').join('');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate(){
        const page = this.queryOBJ.page * 1 || 1;
        const limit = this.queryOBJ.limit * 1 || 100;
        const skip = (page - 1 ) * limit ;

        this.query = this.query.skip(skip).limit(limit);
        // if (this.query.page){   //can't use it cuz await not exist in async function 
        //     const numTours = await Tour.countDocuments();
        //     if (skip > numTours) throw new Error('This page does not exist');
        // }
        return this;
    }
};


module.exports = APIFeatures;