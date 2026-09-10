class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;       // Mongoose query
        this.queryStr = queryStr; // req.query
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i",
                  },
              }
            : {};

        this.query = this.query.find({ ...keyword });

        return this;
    }

    filter(){
        const queryCopy={...this.queryStr}
        const removeFeilds=["keyword","page","limit"];
        removeFeilds.forEach(key=>delete queryCopy[key])
        this.query=this.query.find(queryCopy);
        return this;
    } 
}

export default APIFeatures;